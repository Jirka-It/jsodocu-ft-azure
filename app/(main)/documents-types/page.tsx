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
import BasicStates from '@components/TableExtensions/BasicStates';
import { InputSwitch } from 'primereact/inputswitch';
import { State } from '@enums/StateEnum';

const Documents = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [documentType, setDocumentType] = useState<IDocType>(null);
    const [data, setData] = useState<IDocTypeResponse>();

    useEffect(() => {
        getData();
    }, [checked]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? State.ACTIVE : State.INACTIVE;
        const res = await findAll({ page, size, state });
        setData(res);
    };

    //Table actions

    const handleCheck = (check: boolean) => {
        setChecked(check);
    };

    const handleEdit = (data: IDocType) => {
        setDocumentType(data);
        setOpenModal(true);
    };

    const handleModalDelete = (data: IDocType) => {
        setDocumentType(data);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setDocumentType(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocumentType(null);
        }
    };

    return (
        <div className="layout-permissions">
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Tipo de documento" />
            <DocumentTypeModal state={openModal} data={documentType} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(documentType._id)} update={() => handleUpdate()} />
            <div className="card">
                {data ? (
                    <div className="w-full flex justify-content-end mb-5">
                        <InputSwitch checked={checked} onChange={(e) => handleCheck(e.value)} />
                    </div>
                ) : (
                    ''
                )}
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
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <DocumentTypeActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
