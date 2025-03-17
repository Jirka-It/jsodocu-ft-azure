'use client';
const { format } = require('date-fns');
import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';

import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentModal from '@components/Modals/DocumentModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';
import { findAll, remove, updateWithState } from '@api/documents';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State } from '@enums/DocumentEnum';
import { showError, showInfo, showWarn } from '@lib/ToastMessages';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { useDispatch } from 'react-redux';
import { addInEdition } from '@store/slices/menuSlices';

const Documents = () => {
    const dispatch = useDispatch();
    const toast = useRef(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [document, setDocument] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();
    const [dates, setDates] = useState(null);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates, debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, step: State.ARCHIVED };
        if (searchParam) params['searchParam'] = searchParam;
        if (dates && dates[0] && dates[1]) {
            params['startDate'] = format(dates[0], 'yyyy-MM-dd');
            params['endDate'] = format(dates[1], 'yyyy-MM-dd');
        }

        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleActive = async (data: IDocument) => {
        try {
            const res = await updateWithState(data._id, {
                step: State.EDITION,
                dateOfUpdate: format(new Date(), 'yyyy-MM-dd')
            });

            dispatch(addInEdition());

            if (res.status === HttpStatus.FORBIDDEN) {
                showError(toast, '', 'El documento ya fué enviado a edición');
                return;
            }

            if (!res) {
                showWarn(toast, '', 'Contacte con soporte');
            } else {
                showInfo(toast, '', 'Documento en edición');
                getData();
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setDocument(null);
            setTableState(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocument(null);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <DocumentModal state={openModal} toast={toast} data={document} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} toast={toast} setState={(e) => setOpenModalClose(e)} api={() => remove(document._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full flex justify-content-end mb-3">
                    <div className="flex align-items-center">
                        <Calendar value={dates} placeholder="Rango de fechas" className="mr-3" onChange={(e) => setDates(e.value)} showButtonBar selectionMode="range" readOnlyInput locale="es" />

                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
                </div>

                <DataTable value={data?.data} lazy paginator={true} first={tableState?.first ?? 0} rows={data?.elementsByPage} onPage={(e) => handlePagination(e)} totalRecords={data?.elementsByPage * data?.totalPages}>
                    <Column field="_id" header="Id" body={(rowData: IDocument) => <Badge onClick={() => handleCopy(rowData?._id)} className="cursor-pointer text-lg" value={`${rowData?._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="type.name" header="Tipo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="createdAt" header="Fecha" body={(rowData: IDocument) => `${format(rowData?.createdAt, 'dd/MM/yyyy hh:mm:ss')}`}></Column>
                    <Column field="version" header="Versión" body={(rowData) => `V. ${rowData?.version}`}></Column>
                    <Column field="step" body={(rowData) => <DocumentStates state={rowData?.step} />} header="Estado"></Column>
                    <Column
                        field="actions"
                        body={(rowData) => (
                            <>
                                <Button onClick={() => handleActive(rowData)} icon="pi pi-check-circle" severity="success" tooltip="Activar documento" />
                            </>
                        )}
                        header="Acciones"
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
