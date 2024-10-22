'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/ConfigurationEnum';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import BasicActions from '@components/TableExtensions/BasicActions';
import BasicStates from '@components/TableExtensions/BasicStates';

const Permissions = () => {
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
        console.log('edit', id);
    };

    const handleDelete = (id: string) => {
        console.log('delete', id);
    };

    return (
        <div className="layout-permissions">
            <Button icon="pi pi-plus" className="mr-2 mb-3" label="Permiso" />
            <div className="card">
                <DataTable value={documents} tableStyle={{ minWidth: '50rem' }}>
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
