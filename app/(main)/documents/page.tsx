'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentActions from '@components/TableExtensions/DocumentActions';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentModal from '@components/Modals/DocumentModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';

import { useRouter } from 'next/navigation';
import { findAll, remove } from '@api/documents';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';

const Documents = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [document, setDocument] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();

    const router = useRouter();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const res = await findAll({ page, size });
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/${id}`);
    };
    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: IDocument) => {
        setDocument(data);
        setOpenModal(true);
    };

    const handleModalDelete = (data: IDocument) => {
        setDocument(data);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setDocument(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocument(null);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <DocumentModal state={openModal} data={document} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(document._id)} update={() => handleUpdate()} />
            <div className="card">
                <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Documento" />

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
                    <Column field="_id" header="Id" body={(rowData: IDocument) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="type.name" header="Tipo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="createdAt" header="Fecha"></Column>
                    <Column field="version" header="Versión" body={(rowData) => `V. ${rowData.version}`}></Column>
                    <Column field="step" body={(rowData) => <DocumentStates state={rowData.step} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <DocumentActions handleView={() => handleView(rowData._id)} handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
