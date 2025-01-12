'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewPageEvent } from 'primereact/dataview';
import DeleteModal from '@components/Modals/DeleteModal';
import TemplateModal from '@components/Modals/TemplateModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';

import { useRouter } from 'next/navigation';
import { findAll, remove, updateWithState } from '@api/documents';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State } from '@enums/DocumentEnum';
import { Scope } from '@enums/DocumentEnum';
import { showError, showInfo, showWarn } from '@lib/ToastMessages';
import { HttpStatus } from '@enums/HttpStatusEnum';
import TemplateInformationCard from '@components/Cards/TemplateInformationCard';

const Documents = () => {
    const toast = useRef(null);
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [dataViewState, setDataViewState] = useState<DataViewPageEvent>();
    const [document, setDocument] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const params = { page, size, template: true, scope: Scope.DEFAULT };
        if (searchParam) params['searchParam'] = searchParam;
        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/documents/in-edition/${id}`);
    };

    const handleArchive = async (data: IDocument) => {
        try {
            const res = await updateWithState(data._id, {
                step: State.ARCHIVED
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

    const handleEdit = (data) => {
        setDocument(data);
        setOpenModal(true);
    };

    const handleModalDelete = (data: IDocument) => {
        setDocument(data);
        setOpenModalClose(true);
    };

    const handlePagination = (e: DataViewPageEvent) => {
        setDataViewState(e);
        getData(e.page + 1);
    };

    const handleUpdate = (pageNumber: number = null, update: boolean = true) => {
        if (update) {
            const page = pageNumber ? pageNumber : dataViewState ? dataViewState?.page + 1 : 1;
            setDocument(null);
            setDataViewState(null);
            getData(page, data?.elementsByPage);
        } else {
            setDocument(null);
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <TemplateModal state={openModal} scope={Scope.DEFAULT} toast={toast} data={document} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <DeleteModal state={openModalClose} toast={toast} setState={(e) => setOpenModalClose(e)} api={() => remove(document._id)} update={() => handleUpdate()} />
            <div className="card">
                <div className="w-full flex justify-content-between mb-3">
                    <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="ml-2" label="Template" />

                    <div className="flex align-items-center">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <i className="pi pi-refresh cursor-pointer" style={{ fontSize: '2rem' }} onClick={() => handleUpdate(1, true)}></i>
                    </div>
                </div>

                <DataView
                    value={data?.data}
                    lazy
                    paginator={true}
                    first={dataViewState?.first ?? 0}
                    rows={data?.elementsByPage}
                    onPage={(e) => handlePagination(e)}
                    totalRecords={data?.elementsByPage * data?.totalPages}
                    itemTemplate={(doc: IDocument, i) => <TemplateInformationCard key={i} name={doc.name} type={doc.type.name} state={doc.state} handleEdit={() => handleEdit(doc)}></TemplateInformationCard>}
                />
            </div>
        </div>
    );
};

export default Documents;
