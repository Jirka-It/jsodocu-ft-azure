import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { RootState } from '@store/store';
import { useRouter } from 'next/navigation';
import { setShowGuardModal } from '@store/slices/modalSlices';

export default function AlertGuardModal() {
    const router = useRouter();
    const dispatch = useDispatch();

    const modalG = useSelector((state: RootState) => state.modal);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Acceso Prohibido</span>
        </div>
    );

    const footerContent = (
        <div className="flex justify-content-center">
            <Button label="Ir al dashboard" severity="danger" onClick={() => handleClose()} />
        </div>
    );

    const handleClose = async () => {
        dispatch(setShowGuardModal(false));
        router.push('/');
    };

    return (
        <Dialog
            visible={modalG.showGuardModal}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!modalG.showGuardModal) return;
            }}
        >
            <div>
                <i className="pi pi-exclamation-triangle flex justify-content-center text-yellow-500" style={{ fontSize: '10rem' }}></i>
                <p className="mt-2 font-semibold text-center">Usted no tiene privilegios para acceder a esta vista</p>
            </div>
        </Dialog>
    );
}
