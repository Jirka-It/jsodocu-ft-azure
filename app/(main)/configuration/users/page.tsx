'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { State } from '@enums/ConfigurationEnum';
import { Button } from 'primereact/button';
import BasicActions from '@components/TableExtensions/BasicActions';
import BasicStates from '@components/TableExtensions/BasicStates';
import UserModal from '@components/Modals/UserModal';
import DeleteModal from '@components/Modals/DeleteModal';

const Users = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);

    const [users, setUsers] = useState([
        {
            id: 55,
            user: 'bomj321',
            name: 'Jonathan Peña.',
            state: State.INACTIVE,
            actions: ''
        },
        {
            id: 56,
            user: 'bomj321',
            name: 'Jonathan Peña.',
            state: State.ACTIVE,
            actions: ''
        },
        {
            id: 57,
            user: 'bomj321',
            name: 'Jonathan Peña.',
            state: State.INACTIVE,
            actions: ''
        },
        {
            id: 58,
            user: 'bomj321',
            name: 'Jonathan Peña.',
            state: State.ACTIVE,
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
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Usuario" />
            <UserModal state={openModal} setState={(e) => setOpenModal(e)} />
            <DeleteModal state={openModalClose} setState={(e) => setOpenModalClose(e)} />
            <div className="card">
                <DataTable value={users} tableStyle={{ minWidth: '50rem' }} paginator rows={10} onPage={(e) => console.log(e)}>
                    <Column field="id" header="ID"></Column>
                    <Column field="user" header="Usuario"></Column>
                    <Column field="name" header="Nombre"></Column>
                    <Column field="state" body={(rowData) => <BasicStates state={rowData.state} />} header="Estado"></Column>
                    <Column field="actions" body={(rowData) => <BasicActions handleEdit={() => handleEdit(rowData.id)} handleDelete={() => handleDelete(rowData.id)} />} header="Acciones"></Column>
                </DataTable>
            </div>
        </div>
    );
};

export default Users;
