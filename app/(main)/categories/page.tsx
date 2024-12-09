'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DocumentTypeActions from '@components/TableExtensions/CustomTypeActions';
//import DeleteModal from '@components/Modals/DeleteModal';
import CategoryModal from '@components/Modals/CategoryModal';
import { findAll, remove, update } from '@api/categories';
import BasicStates from '@components/TableExtensions/BasicStates';
import { InputSwitch } from 'primereact/inputswitch';
import { State } from '@enums/StateEnum';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { ICategory, ICategoryResponse } from '@interfaces/ICategory';
import { Badge } from 'primereact/badge';

const Documents = () => {
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [checked, setChecked] = useState(true);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [documentType, setDocumentType] = useState<ICategory>(null);
    const [data, setData] = useState<ICategoryResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleEdit = (data: ICategory) => {
        setDocumentType(data);
        setOpenModal(true);
    };

    /*
    const handleModalDelete = (data: IDocType) => {
        setDocumentType(data);
        setOpenModalClose(true);
    };
   */

    const handleDelete = async (type: ICategory) => {
        const state = type.state === State.ACTIVE ? State.INACTIVE : State.ACTIVE;
        await update(type._id, {
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
            setDocumentType(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocumentType(null);
        }
    };

    return (
        <div className="layout-permissions">
            <Toast ref={toast} />
            <CategoryModal state={openModal} data={documentType} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            {/*            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => remove(documentType._id)} update={() => handleUpdate()} />
             */}
            <div className="card">
                {data ? (
                    <div className="w-full flex justify-content-between mb-3">
                        <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" label="Categoría" />

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
                    <Column field="_id" header="Id" body={(rowData: ICategory) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="state" body={(rowData: ICategory) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData: ICategory) => <DocumentTypeActions data={rowData.state} handleEdit={() => handleEdit(rowData)} handleDelete={() => handleDelete(rowData)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
