'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/ConfigurationEnum';
import { Button } from 'primereact/button';
import BasicActions from '@components/TableExtensions/BasicActions';
import BasicStates from '@components/TableExtensions/BasicStates';
import PermissionModal from '@components/Modals/PermissionModal';
import DeleteModal from '@components/Modals/DeleteModal';

const Permissions = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);

    const [documents, setDocuments] = useState([
        {
            id: 55,
            code: 'CONF-000',
            description: 'Lorem ipsum.',
            state: State.ACTIVE,
            actions: ''
        },
        {
            id: 56,
            code: 'CONF-001',
            description: 'Lorem ipsum.',
            state: State.ACTIVE,
            actions: ''
        },
        {
            id: 57,
            code: 'CONF-002',
            description: 'Lorem ipsum.',
            state: State.INACTIVE,
            actions: ''
        },
        {
            id: 58,
            code: 'CONF-003',
            description: 'Lorem ipsum.',
            state: State.INACTIVE,
            actions: ''
        }
    ]);

    const handleEdit = (id: string) => {
        setOpenModal(true);
    };

    const handleDelete = (id: string) => {
        setOpenModalClose(true);
    };

    return (
        <div className="layout-permissions">
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Permiso" />
            <PermissionModal state={openModal} setState={(e) => setOpenModal(e)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} />
            <div className="card">
                <DataTable value={documents} tableStyle={{ minWidth: '50rem' }} paginator rows={10} onPage={(e) => console.log(e)}>
                    <Column field="id" header="ID"></Column>
                    <Column field="code" header="Código"></Column>
                    <Column field="description" header="Descripción"></Column>
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <BasicActions handleEdit={() => handleEdit(rowData.id)} handleDelete={() => handleDelete(rowData.id)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Permissions;
