'use client';
const { format } = require('date-fns');
import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';

import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';

import { findAll, findExport, remove } from '@api/documents';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State } from '@enums/DocumentEnum';
import { showError, showInfo } from '@lib/ToastMessages';
import { useRouter } from 'next/navigation';

const Documents = () => {
    const toast = useRef(null);
    const router = useRouter();

    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [doc, setDoc] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();
    const [dates, setDates] = useState(null);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dates, debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, step: State.APPROVED };
        if (searchParam) params['searchParam'] = searchParam;
        if (dates && dates[0] && dates[1]) {
            params['startDate'] = format(dates[0], 'yyyy-MM-dd');
            params['endDate'] = format(dates[1], 'yyyy-MM-dd');
        }

        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/approved/${id}`);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleExport = async (data: IDocument) => {
        try {
            showInfo(toast, '', 'Exportando...');
            const res = await findExport(data._id);

            var file = new Blob([res.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const reportXlsxUrl = URL.createObjectURL(file);
            const anchorElement = document.createElement('a');
            anchorElement.href = reportXlsxUrl;
            anchorElement.download = `${data.name}.docx`;
            anchorElement.target = '_blank';

            anchorElement.click();
            anchorElement.remove();
            URL.revokeObjectURL(reportXlsxUrl);
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
            setDoc(null);
            setTableState(null);
            getData(page, data?.elementsByPage);
        } else {
            setDoc(null);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <DeleteModal state={openModalClose} toast={toast} setState={(e) => setOpenModalClose(e)} api={() => remove(doc._id)} update={() => handleUpdate()} />
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
                                <Button onClick={() => handleView(rowData?._id)} icon="pi pi-eye" className="mr-2" severity="help" tooltip="Revisar" />
                                <Button onClick={() => handleExport(rowData)} icon="pi pi-file-import" className="mr-2" tooltip="Exportar" />
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
