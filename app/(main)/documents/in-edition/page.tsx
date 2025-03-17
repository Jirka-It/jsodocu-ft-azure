'use client';
const { format } = require('date-fns');

import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';

import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentActions from '@components/TableExtensions/DocumentActions';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentModal from '@components/Modals/DocumentModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';
import { findAll as findAllDocTypes } from '@api/types';

import { useRouter } from 'next/navigation';
import { findAll, remove, updateWithState } from '@api/documents';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State as StateDocument } from '@enums/DocumentEnum';
import { State } from '@enums/StateEnum';

import { showError, showInfo, showWarn } from '@lib/ToastMessages';
import { CutText } from '@lib/CutText';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { IDocType } from '@interfaces/IDocType';

const Documents = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);

    /***Autocomplete */
    const [docTypes, setDocTypes] = useState<Array<IDocType>>();
    const [docType, setDocType] = useState<any>();
    const [docTypeFilter, setDocTypeFilter] = useState<any>();
    const debouncedDocTypeFilter = useDebounce(docTypeFilter, 800);

    /***Autocomplete */

    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [document, setDocument] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();
    const [dates, setDates] = useState(null);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates, docType, debouncedSearchParam]);

    useEffect(() => {
        if (docTypeFilter !== null) {
            getDocTypes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedDocTypeFilter]);

    //DocTypes

    const getDocTypes = async (page: number = 1, size: number = 5, state: string = State.ACTIVE) => {
        const params = { page, size, state };
        if (docTypeFilter) params['searchParam'] = docTypeFilter;
        setDocTypeFilter(null);
        const res = await findAllDocTypes(params);
        setDocTypes(res.data);
    };

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, step: StateDocument.EDITION };
        if (searchParam) params['searchParam'] = searchParam;
        if (docType) params['docTypeId'] = docType._id;
        if (dates && dates[0] && dates[1]) {
            params['startDate'] = format(dates[0], 'yyyy-MM-dd');
            params['endDate'] = format(dates[1], 'yyyy-MM-dd');
        }

        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/in-edition/${id}`);
    };
    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleArchive = async (data: IDocument) => {
        try {
            const res = await updateWithState(data._id, {
                step: StateDocument.ARCHIVED,
                dateOfUpdate: format(new Date(), 'yyyy-MM-dd')
            });

            if (res.status === HttpStatus.FORBIDDEN) {
                showError(toast, '', 'El documento ya fué archivado');
                return;
            }

            if (!res) {
                showWarn(toast, '', 'Contacte con soporte');
            } else {
                showInfo(toast, '', 'Documento archivado');
                getData();
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
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
            setTableState(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocument(null);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />

            {openModal ? <DocumentModal state={openModal} toast={toast} data={document} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} /> : ''}
            <DeleteModal state={openModalClose} toast={toast} setState={(e) => setOpenModalClose(e)} api={() => remove(document._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full sm:flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2" label="Documento" />

                    <div className="mt-3 sm:mt-0 sm:flex align-items-center">
                        <Calendar value={dates} placeholder="Rango de fechas" className="mr-6 sm:w-15rem" onChange={(e) => setDates(e.value)} showButtonBar selectionMode="range" readOnlyInput locale="es" />
                        <AutoComplete
                            delay={800}
                            showEmptyMessage={true}
                            className="mr-6"
                            emptyMessage="Sin resultados"
                            autoHighlight={true}
                            field="name"
                            placeholder="Tipo"
                            value={docType}
                            suggestions={docTypes}
                            completeMethod={(e) => setDocTypeFilter(e.query)}
                            onSelect={(e) => setDocType(e.value)}
                            onClear={() => setDocType('')}
                        />
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
                </div>

                <DataTable value={data?.data} lazy paginator={true} first={tableState?.first ?? 0} rows={data?.elementsByPage} onPage={(e) => handlePagination(e)} totalRecords={data?.elementsByPage * data?.totalPages}>
                    <Column field="_id" header="Id" body={(rowData: IDocument) => <Badge onClick={() => handleCopy(rowData?._id)} className="cursor-pointer text-lg" value={`${rowData?._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="type.name" header="Tipo"></Column>
                    <Column field="name" header="Nombre" body={(rowData) => `${CutText(rowData?.name)}`}></Column>
                    <Column field="createdAt" header="Fecha" body={(rowData: IDocument) => `${format(rowData?.createdAt, 'dd/MM/yyyy hh:mm:ss')}`}></Column>
                    <Column field="version" header="Versión" body={(rowData) => `V. ${rowData?.version}`}></Column>
                    <Column field="step" body={(rowData) => <DocumentStates state={rowData?.step} />} header="Estado"></Column>
                    <Column
                        field="actions"
                        body={(rowData) => (
                            <DocumentActions handleView={() => handleView(rowData?._id)} handleEdit={() => handleEdit(rowData)} handleDelete={() => handleModalDelete(rowData)}>
                                <Button onClick={() => handleArchive(rowData)} icon="pi pi-folder" className="ml-2" severity="help" tooltip="Archivar" />
                            </DocumentActions>
                        )}
                        header="Acciones"
                    ></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
