'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BasicActions from '@components/TableExtensions/BasicActions';
import PermissionModal from '@components/Modals/PermissionModal';
import DeleteModal from '@components/Modals/DeleteModal';
import { Toast } from 'primereact/toast';
import { IPermission, IPermissionResponse } from '@interfaces/IPermission';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { findAll, remove } from '@api/permissions';
import { Badge } from 'primereact/badge';
import { categories } from '@lib/data';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';

const Permissions = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [permission, setPermission] = useState<IPermission>(null);

    const [data, setData] = useState<IPermissionResponse>();

    useEffect(() => {
        getData();
    }, [debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size };
        if (searchParam) params['searchParam'] = searchParam;

        const res = await findAll(params);
        setData(res);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: IPermission) => {
        setPermission(data);
        setOpenModal(true);
    };

    const handleModalDelete = (data: IPermission) => {
        setPermission(data);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setPermission(null);
            setTableState(null);
            getData(page, data?.elementsByPage);
        } else {
            setPermission(null);
        }
    };

    return (
        <div className="layout-permissions">
            <Toast ref={toast} />
            <PermissionModal state={openModal} toast={toast} data={permission} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} toast={toast} setState={(e) => setOpenModalClose(e)} api={() => remove(permission._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2" label="Permiso" />
                    <div className="flex align-items-center">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} className="mr-3" id="searchParm" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
                </div>
                <DataTable value={data?.data} lazy paginator={true} first={tableState?.first ?? 0} rows={data?.elementsByPage} onPage={(e) => handlePagination(e)} totalRecords={data?.elementsByPage * data?.totalPages}>
                    <Column field="_id" header="Id" body={(rowData: IPermission) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="code" header="Código"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="category" header="Categoría" body={(rowData: IPermission) => `${categories.find((c) => c.code === rowData.category)?.name}`}></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="actions" body={(rowData) => <BasicActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Permissions;
