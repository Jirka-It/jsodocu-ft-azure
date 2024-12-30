import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalDelete } from '@interfaces/IModal';

import { showSuccess, showError } from '@lib/ToastMessages';
import { IDocumentResponse } from '@interfaces/IDocument';
import { HttpStatus } from '@enums/HttpStatusEnum';

export default function DeleteModal({ state, setState, api, update, toast }: IModalDelete) {
    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Eliminar</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Eliminar" onClick={() => handleDelete()} />
        </div>
    );

    const handleDelete = async () => {
        const res: IDocumentResponse = await api();

        if (res.status === HttpStatus.OK) {
            showSuccess(toast, '', 'Registro eliminado.');
            setState(!state);
            update();
        } else {
            showError(toast, '', 'Contacte con soporte');
        }

        //Validate data
    };

    const handleClose = async () => {
        setState(!state);
    };

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <p>¿Estás seguro de eliminar este registro?</p>
        </Dialog>
    );
}
