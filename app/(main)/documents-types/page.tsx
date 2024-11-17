'use client';

import React, { useEffect, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentTypeActions from '@components/TableExtensions/DocumentTypeActions';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentTypeModal from '@components/Modals/DocumentTypeModal';
import { findAll, remove } from '@api/types';
import { IDocType, IDocTypeResponse } from '@interfaces/IDocType';

const Documents = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [document, setDocument] = useState<IDocType>(null);
    const [data, setData] = useState<IDocTypeResponse>();

    useEffect(() => {
        getData();
    }, []);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const res = await findAll({ page, size });
        setData(res);
    };

    //Table actions

    const handleEdit = (data: IDocType) => {
        setDocument(data);
        setOpenModal(true);
    };

    const handleModalDelete = (data: IDocType) => {
        setDocument(data);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null) => {
        const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
        setDocument(null);
        getData(page, data?.elementsByPage);
    };

    return (
        <div className="layout-permissions">
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Tipo de documento" />
            <DocumentTypeModal state={openModal} data={document} setState={(e) => setOpenModal(e)} update={(page) => handleUpdate(page)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(document._id)} update={() => handleUpdate()} />
            <div className="card">
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
                    <Column field="code" header="Código"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="state" header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <DocumentTypeActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
