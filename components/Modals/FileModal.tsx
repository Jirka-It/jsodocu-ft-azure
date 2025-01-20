import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalCreate } from '@interfaces/IModal';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { showError, showSuccess } from '@lib/ToastMessages';
import { newFile, parsingFile } from '@lib/File';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { create } from '@api/file';
import { update as updateArticle, findFiles } from '@api/articles';
import { update as updateParagraph, findFiles as findParagraphFiles } from '@api/paragraphs';
import { INodeGeneral } from '@interfaces/INode';
import { IFileTable } from '@interfaces/IFile';

export default function FileModal({ state, setState, data, toast }: IModalCreate) {
    const [files, setFiles] = useState<Array<IFileTable>>(null);
    const [node, setNode] = useState<INodeGeneral>(data);
    const table = useRef(null);

    const inputFile = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data) {
            const isArticle = node.article || false;
            getFiles(isArticle, node._id);
        } else {
            setFiles([]);
        }
    }, [node]);

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

    //Find Files

    const getFiles = async (article: boolean, id: string) => {
        if (article) {
            const res = await findFiles(id);
            if (res && res.files) {
                const files = res.files.map((f) => parsingFile(f));

                setFiles(files);
            }
        } else {
            const res = await findParagraphFiles(id);
            if (res && res.files) {
                const files = res.files.map((f) => parsingFile(f));
                setFiles(files);
            }
        }
    };

    // Events in buttons
    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const handleChange = async (e) => {
        const filePaths: IFileTable[] = files; // Variable to table
        const filesString: string[] = files.map((f) => f.filePath); // Variable to API
        for (let i = 0; i < e.target.files.length; i++) {
            const bodyFormData = new FormData();
            const fileRenamed = await newFile('SODOCU_ATTACH', e.target.files[i]);
            bodyFormData.append('file', fileRenamed);
            const res = await create(bodyFormData);

            const parsedFile = parsingFile(res.filePath);

            //Parsing filePath
            filePaths.unshift(parsedFile);
            filesString.unshift(res.filePath);
        }

        await updateArticle(node._id, { files: filesString });

        setFiles(filePaths);
        table.current.reset();
        showSuccess(toast, '', 'Documentos agregados');
    };

    //Table event

    const handleClose = async () => {
        setState(!state);
        setNode(null);
        setFiles([]);
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

                <DataTable ref={table} value={files} paginator tableStyle={{ minWidth: '50rem' }} rows={5}>
                    <Column field="name" sortable header="Documento" body={(rowData: IFileTable) => `${rowData.ext} ${rowData.name}`}></Column>
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
