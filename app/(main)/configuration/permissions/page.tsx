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
import { showError } from '@lib/ToastMessages';

const Permissions = () => {
    const toast = useRef(null);
    const [timer, setTimer] = useState(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [searchParam, setSearchParam] = useState<string>('');
    const [permission, setPermission] = useState<IPermission>(null);

    const [data, setData] = useState<IPermissionResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10, search: string = '') => {
        const param = search ? search : searchParam;
        const res = await findAll({ page, size, searchParam: param });
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

    const handleChange = async (searchParam: string) => {
        setSearchParam(searchParam);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                getData(1, data?.elementsByPage, searchParam);
            } catch (error) {
                showError(toast, '', 'Contacte con soporte');
            }
        }, 1000);

        setTimer(newTimer);
    };

    return (
        <div className="layout-permissions">
            <Toast ref={toast} />
            <PermissionModal state={openModal} data={permission} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(permission._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2" label="Permiso" />

                    <InputText value={searchParam} onChange={(e) => handleChange(e.target.value)} id="searchParm" type="text" placeholder="Buscar" />
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
