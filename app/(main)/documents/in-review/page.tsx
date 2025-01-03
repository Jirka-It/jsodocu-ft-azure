'use client';
const { format } = require('date-fns');
import React, { useEffect, useRef, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';
import { findAll, updateWithState } from '@api/documents';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State } from '@enums/DocumentEnum';
import { showError, showInfo, showWarn } from '@lib/ToastMessages';

const Documents = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [tableState, setTableState] = useState<DataTableStateEvent>();
    const [data, setData] = useState<IDocumentResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, step: State.REVIEW };
        if (searchParam) params['searchParam'] = searchParam;
        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/in-review/${id}`);
    };

    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleArchive = async (data: IDocument) => {
        try {
            const res = await updateWithState(data._id, {
                step: State.ARCHIVED
            });
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

    const handlePagination = (e: DataTableStateEvent) => {
        setTableState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : tableState ? tableState?.page + 1 : 1;
            setTableState(null);
            getData(page, data?.elementsByPage);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <div className="card">
                <div className="w-full flex justify-content-end mb-3">
                    <div className="flex align-items-center">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
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
                    <Column field="_id" header="Id" body={(rowData: IDocument) => <Badge onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Badge>}></Column>
                    <Column field="type.name" header="Tipo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="createdAt" header="Fecha" body={(rowData: IDocument) => `${format(rowData.createdAt, 'dd/MM/yyyy hh:mm:ss')}`}></Column>
                    <Column field="reviewer" header="Revisor" body={(rowData) => `${rowData.reviewer?.name} ${rowData.reviewer?.lastName}`}></Column>
                    <Column field="version" header="Versión" body={(rowData) => `V. ${rowData.version}`}></Column>
                    <Column field="step" body={(rowData) => <DocumentStates state={rowData.step} />} header="Estado"></Column>
                    <Column
                        field="actions"
                        body={(rowData) => (
                            <>
                                <Button onClick={() => handleView(rowData._id)} icon="pi pi-file-import" className="mr-2" tooltip="Revisar" />
                                <Button onClick={() => handleArchive(rowData)} icon="pi pi-folder" severity="help" tooltip="Archivar" />
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
