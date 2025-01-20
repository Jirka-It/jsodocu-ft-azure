import React, { useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalCreate } from '@interfaces/IModal';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { showSuccess } from '@lib/ToastMessages';

const files = [
    {
        name: 'word',
        date: '22-05-2024'
    }
];

export default function FileModal({ state, setState, data, toast }: IModalCreate) {
    const inputFile = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state) {
        }
    }, [state]);

    useEffect(() => {}, [data]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Documentos</span>
        </div>
    );

    const footerContent = (
        <div className="text-center">
            <Button label="Cerrar" severity="danger" onClick={() => handleClose()} />
        </div>
    );

    // Events in buttons

    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const handleChange = async (e) => {
        console.log('e.target.files', e.target.files);
        showSuccess(toast, '', 'Documentos agregados');
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
            style={{ width: '60rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div>
                <Button icon="pi pi-plus" className="mb-4" label="Adjuntar" onClick={onFileUploadClick}>
                    <input className=" hidden" type="file" onChange={handleChange} multiple ref={inputFile} />
                </Button>

                <DataTable value={files} tableStyle={{ minWidth: '50rem' }} paginator={true} rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
                    <Column field="name" sortable header="Documento"></Column>
                    <Column field="date" header="Fecha de cargue"></Column>
                    <Column
                        field="actions"
                        body={(rowData) => (
                            <>
                                <Button icon="pi pi-trash" className="mr-2" severity="danger" tooltip="Borrar" />
                                <Button icon="pi pi-eye" tooltip="Revisar" />
                            </>
                        )}
                        header="Acciones"
                    ></Column>
                </DataTable>
            </div>
        </Dialog>
    );
}
