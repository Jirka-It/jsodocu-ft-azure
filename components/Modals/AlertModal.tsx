import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { RootState } from '@store/store';
import { setShowModal } from '@store/slices/modalSlices';
import { signOut } from 'next-auth/react';

export default function AlertModal() {
    const dispatch = useDispatch();

    const modalD = useSelector((state: RootState) => state.modal);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Sesión de usuario</span>
        </div>
    );

    const footerContent = (
        <div className="flex justify-content-center">
            <Button label="Login" severity="danger" onClick={() => handleClose()} />
        </div>
    );

    const handleClose = async () => {
        signOut({ callbackUrl: '/auth/login', redirect: true });
        dispatch(setShowModal(false));
    };

    return (
        <Dialog
            visible={modalD.showModal}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!modalD.showModal) return;
            }}
        >
            <div>
                <i className="pi pi-exclamation-triangle flex justify-content-center text-yellow-500" style={{ fontSize: '10rem' }}></i>
                <p className="mt-2 font-semibold">Su sesión de usuario ha vencido, es necesario volver a acreditarse</p>
            </div>
        </Dialog>
    );
}
