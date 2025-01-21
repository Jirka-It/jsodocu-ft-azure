'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/StateEnum';
import { Button } from 'primereact/button';
import BasicStates from '@components/TableExtensions/BasicStates';
import UserModal from '@components/Modals/UserModal';
import { InputSwitch } from 'primereact/inputswitch';
import { IUser, IUserResponse } from '@interfaces/IUser';
import { findAll, update } from '@api/users';
import { findAll as findAllAccounts } from '@api/accounts';
import { findAll as findAllRoles } from '@api/roles';

import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';

import { IAccount } from '@interfaces/IAccount';
import useDebounce from '@hooks/debounceHook';
import { IRol } from '@interfaces/IRol';
import UserPasswordModal from '@components/Modals/UserPasswordModal';
import CustomUserTypeActions from '@components/TableExtensions/CustomUserTypeActions';

const Users = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 800);
    const [accounts, setAccounts] = useState<Array<IAccount>>();
    const [account, setAccount] = useState<any>();
    const [accountFilter, setAccountFilter] = useState<any>();
    const debouncedAccountFilter = useDebounce(accountFilter, 800);

    const [roles, setRoles] = useState<Array<IRol>>();
    const [rol, setRol] = useState<any>();
    const [rolFilter, setRolFilter] = useState<any>();
    const debouncedAccountRol = useDebounce(rolFilter, 800);

    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [user, setUser] = useState<IUser>(null);
    const [data, setData] = useState<IUserResponse>();

    useEffect(() => {
        if (accountFilter !== null) {
            getDataAccounts();
        }
    }, [debouncedAccountFilter]);

    useEffect(() => {
        if (rolFilter !== null) {
            getDataRoles();
        }
    }, [debouncedAccountRol]);

    useEffect(() => {
        getData();
    }, [checked, debouncedSearchParam, account, rol]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? State.ACTIVE : State.INACTIVE;

        const params = { page, size, state };
        if (searchParam) params['searchParam'] = searchParam;
        if (account) params['accountId'] = account._id;
        if (rol) params['rolId'] = rol._id;

        const res = await findAll(params);
        setData(res);
    };

    //Accounts

    const getDataAccounts = async (page: number = 1, size: number = 5, state: string = State.ACTIVE) => {
        const params = { page, size, state };
        if (accountFilter) params['searchParam'] = accountFilter;
        setAccountFilter(null);
        const res = await findAllAccounts(params);
        setAccounts(res.data);
    };

    //Roles
    const getDataRoles = async (page: number = 1, size: number = 5, state: string = State.ACTIVE) => {
        const params = { page, size, state };
        if (rolFilter) params['searchParam'] = rolFilter;
        const res = await findAllRoles(params);
        setRolFilter(null);
        if (res && res.data.length > 0) {
            const newData = res.data.sort((a, b) => a.name.localeCompare(b.name));
            setRoles(newData);
        } else {
            setRoles(res.data);
        }
    };

    //Table actions

    const handleCheck = (check: boolean) => {
        setTableState(null);
        setChecked(check);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: IUser) => {
        setUser(data);
        setOpenModal(true);
    };

    const handleEditPassword = (data: IUser) => {
        setUser(data);
        setOpenPasswordModal(true);
    };

    const handleDelete = async (user: IUser) => {
        const state = user.state === State.ACTIVE ? State.INACTIVE : State.ACTIVE;
        await update(user._id, {
            state
        });
        getData(data.page);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setUser(null);
            setTableState(null);
            getData(page, data?.elementsByPage);
        } else {
            setUser(null);
        }
    };

    return (
        <div className="layout-users">
            <Toast ref={toast} />
            <UserModal state={openModal} toast={toast} data={user} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <UserPasswordModal state={openPasswordModal} toast={toast} data={user} setState={(e) => setOpenPasswordModal(e)} />
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button
                        onClick={() => {
                            setOpenModal(true);
                            setUser(null);
                        }}
                        icon="pi pi-plus"
                        className="mr-2"
                        label="Usuario"
                    />
                    <div className="flex align-items-center">
                        <AutoComplete
                            delay={800}
                            showEmptyMessage={true}
                            emptyMessage="Sin resultados"
                            autoHighlight={true}
                            className="w-15rem"
                            field="name"
                            placeholder="Cuenta"
                            value={account}
                            suggestions={accounts}
                            completeMethod={(e) => setAccountFilter(e.query)}
                            onSelect={(e) => setAccount(e.value)}
                            onClear={() => setAccount('')}
                        />

                        <AutoComplete
                            delay={800}
                            showEmptyMessage={true}
                            emptyMessage="Sin resultados"
                            autoHighlight={true}
                            className="w-15rem"
                            field="code"
                            placeholder="Rol"
                            value={rol}
                            suggestions={roles}
                            completeMethod={(e) => setRolFilter(e.query)}
                            onSelect={(e) => setRol(e.value)}
                            onClear={() => setRol('')}
                        />

                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <InputSwitch checked={checked} className="mr-3" onChange={(e) => handleCheck(e.value)} />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
                </div>
                <DataTable value={data?.data} lazy paginator={true} first={tableState?.first ?? 0} rows={data?.elementsByPage} onPage={(e) => handlePagination(e)} totalRecords={data?.elementsByPage * data?.totalPages}>
                    <Column field="_id" header="Id" body={(rowData: IUser) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre" body={(rowData) => `${rowData.name} ${rowData.lastName ?? ''}`}></Column>
                    <Column field="username" header="Usuario"></Column>
                    <Column field="accountId" header="Cuenta" body={(rowData) => `${rowData.accountId ? rowData.accountId.name : ''}`}></Column>
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column
                        field="actions"
                        body={(rowData: IUser) => <CustomUserTypeActions handleEdit={() => handleEdit(rowData)} handleEditPassword={() => handleEditPassword(rowData)} data={rowData.state} handleDelete={() => handleDelete(rowData)} />}
                        header="Acciones"
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Users;
