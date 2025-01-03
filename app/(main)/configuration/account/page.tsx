'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/StateEnum';
import BasicStates from '@components/TableExtensions/BasicStates';
import { InputSwitch } from 'primereact/inputswitch';
import { IAccount, IAccountResponse } from '@interfaces/IAccount';
import CustomTypeActions from '@components/TableExtensions/CustomTypeActions';
import { findAll, update } from '@api/accounts';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';

const Users = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [state, setState] = useState<string>();
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [data, setData] = useState<IAccountResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, state };
        if (searchParam) params['searchParam'] = searchParam;

        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (id: string) => {
        router.push(`/configuration/account/${id}`);
    };

    const handleDelete = async (state: string, id: string) => {
        await update(id, {
            state
        });
        getData(data.page);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    return (
        <div className="layout-accounts">
            <Toast ref={toast} />
            <div className="card">
                <div className="w-full flex justify-content-between align-items-center mb-3">
                    <div>
                        <Badge value="Pendiente" onClick={() => setState(State.PENDING)} className="mr-2 cursor-pointer" severity="warning"></Badge>
                        <Badge value="Activo" onClick={() => setState(State.ACTIVE)} className="mr-2 cursor-pointer" severity="success"></Badge>
                        <Badge value="Inactivo" onClick={() => setState(State.INACTIVE)} className="cursor-pointer" severity="danger"></Badge>
                    </div>

                    <div className="flex align-items-center">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => getData(1)}></i>
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
                    <Column field="_id" header="Id" body={(rowData: IAccount) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="nit" header="NIT"></Column>
                    <Column field="email" header="Correo"></Column>
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData: IAccount) => <CustomTypeActions handleEdit={() => handleEdit(rowData._id)} data={rowData.state} handleDelete={(e) => handleDelete(e, rowData._id)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Users;
