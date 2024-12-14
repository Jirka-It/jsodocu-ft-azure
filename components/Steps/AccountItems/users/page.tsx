'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/StateEnum';
import { Button } from 'primereact/button';
import BasicStates from '@components/TableExtensions/BasicStates';
import { InputSwitch } from 'primereact/inputswitch';
import { IUser, IUserResponse } from '@interfaces/IUser';
import CustomTypeActions from '@components/TableExtensions/CustomTypeActions';
import { findAll, update } from '@api/users';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { useParams } from 'next/navigation';
import UserModalAccount from '@components/Modals/UserModalAccount';

const Users = () => {
    const toast = useRef(null);
    const params = useParams();
    const [openModal, setOpenModal] = useState<boolean>(false);
    // const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [user, setUser] = useState<IUser>(null);
    const [data, setData] = useState<IUserResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? State.ACTIVE : State.INACTIVE;
        const res = await findAll({ page, size, state, accountId: params.id });
        setData(res);
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
            <UserModalAccount state={openModal} data={user} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} account={params.id} />

            {/*  <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => console.log('')} update={() => console.log('')} />  */}
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
                    <InputSwitch checked={checked} onChange={(e) => handleCheck(e.value)} />
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
