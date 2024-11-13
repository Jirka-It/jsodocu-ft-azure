'use client';

import React, { use, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/DocumentEnum';
import { Button } from 'primereact/button';
import DocumentActions from '@components/TableExtensions/DocumentActions';
import DocumentStates from '@components/TableExtensions/DocumentStates';
import DeleteModal from '@components/Modals/DeleteModal';
import DocumentModal from '@components/Modals/DocumentModal';
import { InputSwitch } from 'primereact/inputswitch';
import { useRouter } from 'next/navigation';
import { findAll } from '@api/documents';

const Documents = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [checked, setChecked] = useState(false);
    const router = useRouter();

    const [documents, setDocuments] = useState([
        {
            id: 55,
            type: 'Reglamento de PH',
            name: 'Conjunto Oporto',
            date: '29 Jul. 2020',
            version: 'V. 1',
            state: State.APPROVED,
            actions: ''
        },
        {
            id: 56,
            type: 'Reglamento de PH (Acid)',
            name: 'Conjunto Oporto ETP 2',
            date: '29 Ago. 2020',
            version: 'V. 2',
            state: State.ARCHIVED,
            actions: ''
        },
        {
            id: 57,
            type: 'Reglamento de PH (Acid)',
            name: 'Conjunto Oporto ETP 2',
            date: '29 Jul. 2020',
            version: 'V. 2',
            state: State.EDITION,
            actions: ''
        },
        {
            id: 58,
            type: 'Reglamento de PH',
            name: 'Conjunto Oporto ETP 2',
            date: '29 Sep. 2020',
            version: 'V. 1',
            state: State.REVISION,
            actions: ''
        }
    ]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await findAll();
        console.log('res', res);
    };

    const handleView = (id: string) => {
        router.push(`/documents/${id}`);
    };

    const handleEdit = (id: string) => {
        setOpenModal(true);
    };

    const handleDelete = (id: string) => {
        setOpenModalClose(true);
    };

    return (
        <div className="layout-permissions">
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Documento" />
            <DocumentModal state={openModal} setState={(e) => setOpenModal(e)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} />
            <div className="card">
                <div className="w-full flex justify-content-end mb-5">
                    <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
                </div>
                <DataTable value={documents} tableStyle={{ minWidth: '50rem' }} paginator rows={10} onPage={(e) => console.log(e)}>
                    <Column field="id" header="ID"></Column>
                    <Column field="type" header="Tipo"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="date" header="Fecha"></Column>
                    <Column field="version" header="Versión"></Column>
                    <Column field="state" body={(rowData) => <DocumentStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <DocumentActions handleView={() => handleView(rowData.id)} handleEdit={() => handleEdit(rowData.id)} handleDelete={() => handleDelete(rowData.id)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Documents;
