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
import CustomTypeActions from '@components/TableExtensions/CustomTypeActions';
import { findAll, update } from '@api/users';
import { findAll as findAllAccounts } from '@api/accounts';
import { findAll as findAllRoles } from '@api/roles';

import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { IAccountResponse } from '@interfaces/IAccount';
import useDebounce from '@hooks/debounceHook';
import { IRolResponse } from '@interfaces/IRol';

const Users = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [accounts, setAccounts] = useState<IAccountResponse>();
    const [accountId, setAccountId] = useState<any>();
    const [accountFilter, setAccountFilter] = useState<any>();
    const debouncedAccountFilter = useDebounce(accountFilter, 500);

    const [roles, setRoles] = useState<IRolResponse>();
    const [rolId, setRolId] = useState<any>();
    const [rolFilter, setRolFilter] = useState<any>();
    const debouncedAccountRol = useDebounce(rolFilter, 500);

    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [user, setUser] = useState<IUser>(null);
    const [data, setData] = useState<IUserResponse>();

    useEffect(() => {
        getDataAccounts();
    }, [debouncedAccountFilter]);

    useEffect(() => {
        getDataRoles();
    }, [debouncedAccountRol]);

    useEffect(() => {
        getData();
    }, [checked, debouncedSearchParam, accountId, rolId]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? State.ACTIVE : State.INACTIVE;

        const params = { page, size, state };
        if (searchParam) params['searchParam'] = searchParam;
        if (accountId) params['accountId'] = accountId;
        if (rolId) params['rolId'] = rolId;

        const res = await findAll(params);
        setData(res);
    };

    //Accounts

    const getDataAccounts = async (page: number = 1, size: number = 5, state: string = State.ACTIVE) => {
        const params = { page, size, state };
        if (accountFilter) params['searchParam'] = accountFilter;

        const res = await findAllAccounts(params);
        setAccounts(res);
    };

    //Roles
    const getDataRoles = async (page: number = 1, size: number = 5, state: string = State.ACTIVE) => {
        const params = { page, size, state };
        if (rolFilter) params['searchParam'] = rolFilter;
        const res = await findAllRoles(params);
        setRoles(res);
    };

    //Table actions

    const handleCheck = (check: boolean) => {
        setChecked(check);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: IUser) => {
        setUser(data);
        setOpenModal(true);
    };

    /*
    const handleModalDelete = (data: IDocType) => {
        setDocumentType(data);
        setOpenModalClose(true);
    };
   */

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
            getData(page, data?.elementsByPage);
        } else {
            setUser(null);
        }
    };

    return (
        <div className="layout-users">
            <Toast ref={toast} />
            <UserModal state={openModal} data={user} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
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
                        <Dropdown
                            value={accountId}
                            onChange={(e) => setAccountId(e.value)}
                            onFilter={(e) => setAccountFilter(e.filter)}
                            options={accounts?.data}
                            filter
                            showClear={true}
                            clearIcon="pi pi-times"
                            emptyMessage="Sin resultados"
                            emptyFilterMessage="Sin resultados"
                            id="account"
                            optionLabel="name"
                            optionValue="_id"
                            placeholder="Buscar por cuenta"
                            className="w-15rem mr-3"
                        />

                        <Dropdown
                            value={rolId}
                            onChange={(e) => setRolId(e.value)}
                            onFilter={(e) => setRolFilter(e.filter)}
                            options={roles?.data}
                            filter
                            showClear={true}
                            clearIcon="pi pi-times"
                            emptyMessage="Sin resultados"
                            emptyFilterMessage="Sin resultados"
                            id="rol"
                            optionLabel="name"
                            optionValue="_id"
                            placeholder="Buscar por rol"
                            className="w-15rem mr-3"
                        />

                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <InputSwitch checked={checked} onChange={(e) => handleCheck(e.value)} />
                    </div>
                </div>
                <DataTable
                    value={data?.data}
                    lazy
                    tableStyle={{ minWidth: '50rem' }}
                    paginator={true}
                    first={tableState?.first ?? 0}
                    rows={data?.elementsByPage}
                    onPage={(e) => handlePagination(e)}
                    totalRecords={data?.elementsByPage * data?.totalPages}
                >
                    <Column field="_id" header="Id" body={(rowData: IUser) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="lastName" header="Apellido"></Column>
                    <Column field="username" header="Usuario"></Column>
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData: IUser) => <CustomTypeActions handleEdit={() => handleEdit(rowData)} data={rowData.state} handleDelete={() => handleDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Users;
