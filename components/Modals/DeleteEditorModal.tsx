import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalEditorDelete } from '@interfaces/IModal';

import { Toast } from 'primereact/toast';

export default function DeleteEditorModal({ state, setState, remove }: IModalEditorDelete) {
    const toast = useRef(null);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Eliminar</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Eliminar" onClick={() => remove()} />
        </div>
    );

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
            <Toast ref={toast} />
            <p>¿Estás seguro de eliminar este registro?</p>
        </Dialog>
    );
}
