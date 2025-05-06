'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewPageEvent } from 'primereact/dataview';
import TemplateModal from '@components/Modals/TemplateModal';
import { IDocument, IDocumentResponse } from '@interfaces/IDocument';

import { useRouter } from 'next/navigation';
import { findAll, templateToDoc, update } from '@api/documents';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import useDebounce from '@hooks/debounceHook';
import { State as StateDoc } from '@enums/StateEnum';

import { Scope } from '@enums/DocumentEnum';
import { showError, showSuccess } from '@lib/ToastMessages';
import TemplateDefaultInformationCard from '@components/Cards/TemplateDefaultInformationCard';
import { InputSwitch } from 'primereact/inputswitch';
import { addInEdition } from '@store/slices/menuSlices';
import { useDispatch } from 'react-redux';
import { VerifyPermissions } from '@lib/Permissions';
import { Permission } from '@enums/PermissionEnum';
import { useSession } from 'next-auth/react';

const Documents = () => {
    const { data: session }: any = useSession(); //data:session
    const toast = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [checked, setChecked] = useState(true);
    const [searchParam, setSearchParam] = useState<string>('');
    const debouncedSearchParam = useDebounce(searchParam, 500);
    const [dataViewState, setDataViewState] = useState<DataViewPageEvent>();
    const [document, setDocument] = useState<IDocument>(null);
    const [data, setData] = useState<IDocumentResponse>();

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked, debouncedSearchParam]);

    const getData = async (page: number = 1, size: number = data ? data?.elementsByPage : 10) => {
        const state = checked ? StateDoc.ACTIVE : StateDoc.INACTIVE;
        const params = { page, size, state, template: true, scope: Scope.DEFAULT };
        if (searchParam) params['searchParam'] = searchParam;
        const res = await findAll(params);
        setData(res);
    };

    //Table actions

    const handleView = (id: string) => {
        router.push(`/templates/${id}`);
    };

    const handleCheck = (check: boolean) => {
        setDataViewState(null);
        setChecked(check);
    };

    const handleEdit = (data) => {
        setDocument(data);
        setOpenModal(true);
    };

    const handleDelete = async (template: IDocument) => {
        const state = template.state === StateDoc.ACTIVE ? StateDoc.INACTIVE : StateDoc.ACTIVE;
        await update(template._id, {
            state
        });
        getData(data.page);
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

    const handleTemplateToDoc = async (doc: IDocument) => {
        try {
            await templateToDoc(doc._id);
            dispatch(addInEdition());
            showSuccess(toast, '', `Documento ${doc.name} creado`);
        } catch (error) {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <div className="layout-documents">
            <Toast ref={toast} />
            <TemplateModal state={openModal} scope={Scope.DEFAULT} toast={toast} data={document} setState={(e) => setOpenModal(e)} update={(page, update) => handleUpdate(page, update)} />
            <div className="card">
                <div className={`w-full flex justify-content-between mb-3`}>
                    {VerifyPermissions(session?.access_token, [Permission.DEFAULT_TEMPLATES_BUTTON]) ? <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" label="Plantilla" /> : <div></div>}

                    <div className="flex align-items-center">
                        <InputText value={searchParam} onChange={(e) => setSearchParam(e.target.value)} id="searchParm" className="mr-3" type="text" placeholder="Buscar" />
                        <InputSwitch checked={checked} className="mr-3" onChange={(e) => handleCheck(e.value)} />

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
                    itemTemplate={(doc: IDocument, i) => (
                        <TemplateDefaultInformationCard
                            key={i}
                            name={doc.name}
                            type={doc.type.name}
                            state={doc.state}
                            handleEdit={() => handleEdit(doc)}
                            handleView={() => handleView(doc._id)}
                            handleTemplateToDoc={() => handleTemplateToDoc(doc)}
                            handleDelete={() => handleDelete(doc)}
                        ></TemplateDefaultInformationCard>
                    )}
                />
            </div>
        </div>
    );
};

export default Documents;
