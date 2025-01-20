import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalCreate } from '@interfaces/IModal';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { showError, showSuccess } from '@lib/ToastMessages';
import { iconFile, newFile, parsingFile } from '@lib/File';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { findFile, create, remove } from '@api/file';
import { update as updateArticle } from '@api/articles';
import { update as updateParagraph } from '@api/paragraphs';
import { INodeGeneral } from '@interfaces/INode';
import { IFileTable } from '@interfaces/IFile';

export default function FileModal({ state, setState, data, toast }: IModalCreate) {
    const [files, setFiles] = useState<Array<IFileTable>>(null);
    const [node, setNode] = useState<INodeGeneral>(data);
    const table = useRef(null);

    const inputFile = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (node) {
            const isArticle = node.article || false;
            getFiles(isArticle, node.files);
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

    const getFiles = async (article: boolean, files: string[]) => {
        if (article) {
            if (files) {
                const newFiles = files.map((f) => parsingFile(f));
                setFiles(newFiles);
            }
        } else {
            if (files) {
                const newFiles = files.map((f) => parsingFile(f));
                setFiles(newFiles);
            }
        }
    };

    // Events in buttons
    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const handleChange = async (e, node: INodeGeneral) => {
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

        if (node.article) {
            await updateArticle(node._id, { files: filesString });
        } else {
            await updateParagraph(node._id, { files: filesString });
        }

        setFiles(filePaths);
        table.current.reset();
        showSuccess(toast, '', 'Documentos agregados');
    };

    const handleDelete = async (data: IFileTable, node: INodeGeneral) => {
        const res = await remove({ filePath: data.filePath });

        //Remove from array of files
        const newArray = files.filter((item) => item.filePath !== data.filePath);
        setFiles(newArray);
        table.current.reset();

        if (res.status === HttpStatus.OK) {
            //Update array of files in bd
            const parsingNewArray = newArray.map((f) => f.filePath);

            if (node.article) {
                await updateArticle(node._id, { files: parsingNewArray });
            } else {
                await updateParagraph(node._id, { files: parsingNewArray });
            }
            showSuccess(toast, '', 'Documento eliminado');
        } else {
            showError(toast, '', 'El documento ya no existe');
        }
    };

    const handleView = async (data: IFileTable) => {
        const res = await findFile({ filePath: data.filePath });

        const reportXlsxUrl = URL.createObjectURL(res);
        const anchorElement = document.createElement('a');
        anchorElement.href = reportXlsxUrl;
        anchorElement.download = `${data.name}`;
        anchorElement.target = '_blank';

        anchorElement.click();
        anchorElement.remove();
        URL.revokeObjectURL(reportXlsxUrl);
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
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div>
                <Button icon="pi pi-plus" className="mb-4" label="Adjuntar" onClick={onFileUploadClick}>
                    <input className=" hidden" type="file" onChange={(e) => handleChange(e, node)} multiple ref={inputFile} />
                </Button>

                <DataTable ref={table} value={files} paginator style={{ width: '50vw' }} rows={5}>
                    <Column
                        field="name"
                        sortable
                        header="Documento"
                        body={(rowData: IFileTable) => {
                            return iconFile(rowData.ext, rowData.name);
                        }}
                    ></Column>
                    <Column field="date" header="Fecha de cargue"></Column>
                    <Column
                        field="actions"
                        body={(rowData) => (
                            <>
                                <Button onClick={() => handleDelete(rowData, node)} icon="pi pi-trash" className="mr-2" severity="danger" tooltip="Borrar" />
                                <Button onClick={() => handleView(rowData)} icon="pi pi-eye" tooltip="Revisar" />
                            </>
                        )}
                        header="Acciones"
                    ></Column>
                </DataTable>
            </div>
        </Dialog>
    );
}
