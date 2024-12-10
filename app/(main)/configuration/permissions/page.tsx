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

const Permissions = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [permission, setPermission] = useState<IPermission>(null);
    const [data, setData] = useState<IPermissionResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const res = await findAll({ page, size });
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
            getData(page, data?.elementsByPage);
        } else {
            setPermission(null);
        }
    };

    return (
        <div className="layout-permissions">
            <Toast ref={toast} />
            <PermissionModal state={openModal} data={permission} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(permission._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2" label="Permiso" />
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
                    <Column field="_id" header="Id" body={(rowData: IPermission) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="code" header="Código"></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="actions" body={(rowData) => <BasicActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Permissions;
