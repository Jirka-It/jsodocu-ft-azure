import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import ReactQuill from 'react-quill';

import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { INode, INodeGeneral } from '@interfaces/INode';
import { IVariableLight } from '@interfaces/IVariable';
import { replaceText } from '@lib/ReplaceText';
import { addSection, deleteSection, handleChangeEvent } from '@lib/Editor';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showSuccess } from '@lib/ToastMessages';
import { findById, update } from '@api/articles';
import DeleteEditorModal from '@components/Modals/DeleteEditorModal';
import EditorToolbar, { formats } from './EditorToolbar';

import { findAllWithOutPagination } from '@api/variables';
import { findAll as findAllChapters, create } from '@api/chapters';
import { findById as findParagraph, update as updateParagraph } from '@api/paragraphs';
import { findByIdLight as findDocument, update as updateDocument } from '@api/documents';

import styles from './Editor.module.css';
import 'react-quill/dist/quill.snow.css';

export default function Editor({ document }) {
    const toast = useRef(null);
    const quill = useRef(null);
    const params = useParams();
    const [timer, setTimer] = useState(null);
    const [nodes, setNodes] = useState<Array<INode>>();
    const [modules, setModules] = useState<any>(null);

    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [variables, setVariables] = useState<Array<IVariableLight>>([]);
    const [content, setContent] = useState<string>(null);
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [nodeSelectedToDelete, setNodeSelectedToDelete] = useState<INodeGeneral>(null);
    const [expandedKeys, setExpandedKeys] = useState<any>();

    useEffect(() => {
        getChapters();
        getVariables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Quill functions

    const addComment = () => {
        var prompt = window.prompt('Ingrese un comentario', '');
        var txt;
        if (prompt == null || prompt == '') {
            txt = 'User cancelled the prompt.';
        } else {
            const range = quill.current.unprivilegedEditor.getSelection();
            if (range) {
                if (range.length == 0) {
                    alert('Selecciona un texto');
                } else {
                    var text = quill.current.unprivilegedEditor.getText(range.index, range.length);
                    //metaData.push({ range: range, comment: prompt });
                    quill.current.editor.formatText(range.index, range.length, 'customTag', prompt);
                    // drawComments(metaData);
                }
            } else {
                alert('Editor no seleccionado');
            }
        }
    };

    // Get data and quill's modules
    const getChapters = async () => {
        const res = await findAllChapters({ documentId: params.id });
        setNodes(res.data);
    };

    const getVariables = async () => {
        const res = await findAllWithOutPagination({ documentId: params.id });
        const data = res.data;

        if (data) {
            // This code is to change the name by the value and vice versa
            data.map((r) => {
                const name = r.name;
                const value = r.value;
                (r.name = value), (r.value = name);
                return r;
            });
        }

        setModules({
            toolbar: {
                container: '#toolbar',
                handlers: {
                    comment: addComment
                }
            },
            mention: {
                mentionDenotationChars: ['@'],
                source: (searchTerm: string, renderList: (data: any, searchText: string) => void, mentionChar: string) => {
                    let values = data;
                    // sample data set for displaying
                    if (searchTerm.length === 0) {
                        renderList(values, searchTerm);
                    } else {
                        const matches = [];
                        for (let i = 0; i < values.length; i++) if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
                        renderList(matches, searchTerm);
                    }
                }
            },
            history: {
                delay: 500,
                maxStack: 100,
                userOnly: true
            }
        });

        setVariables(data);
    };

    // Event to load tree

    const nodeTemplate = (node, options) => {
        let label = <b>{node.label}</b>;

        if (node.chapter || node.article) {
            label = (
                <div className="p-inputgroup flex-1 h-2rem">
                    <InputText
                        onClick={() => handleClickEvent(node.chapter ? null : node)}
                        value={node.value}
                        onChange={(e) => handleChangeEvent(node, e.target.value, setNodes, timer, setTimer)}
                        className={`${styles['input-node']} w-full`}
                        type="text"
                        placeholder={node.chapter ? 'Capítulo' : 'Artículo'}
                    />
                    <Button icon="pi pi pi-plus" outlined size="small" className="p-button-success" onClick={() => addSection(node, setNodes, setExpandedKeys)} tooltip={node.chapter ? 'Agregar artículo' : 'Agregar paragrafo'} />
                    <Button
                        icon="pi pi pi-times"
                        outlined
                        size="small"
                        className="p-button-danger"
                        onClick={() => {
                            setNodeSelectedToDelete(node);
                            setOpenModalClose(!openModalClose);
                        }}
                        tooltip="Borrar"
                    />
                </div>
            );
        }

        if (node.paragraph) {
            label = (
                <div>
                    <div className="flex align-items-center justify-content-between h-2rem">
                        <h6 className={`m-0 cursor-pointer ${styles['custom-label']}`} onClick={() => handleClickEvent(node)}>
                            {node.label}
                        </h6>
                        <div>
                            <Button
                                size="small"
                                icon="pi pi pi-times"
                                outlined
                                className="p-button-danger h-2rem"
                                onClick={() => {
                                    setNodeSelectedToDelete(node);
                                    setOpenModalClose(!openModalClose);
                                }}
                                tooltip="Borrar"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        return <span className={options.className}>{label}</span>;
    };

    //Button events tree

    const addChapter = async () => {
        const res = await create({
            label: `Capítulo`,
            value: '',
            chapter: true,
            children: [],
            document: params.id
        });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            setNodes((prevArray) => [...prevArray, { ...res.data, key: res.data._id }]);
            showSuccess(toast, '', 'Capítulo creado');
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const deleteNode = async () => {
        //node, setNodes
        await deleteSection(nodeSelectedToDelete, setNodes);
        setNodeSelectedToDelete(null);
        setOpenModalClose(!openModalClose);
    };

    const handleClickEvent = async (node: INodeGeneral) => {
        setContent(null);
        setNodeSelected(null);
        if (node && node.article) {
            const res = await findById(node.key);
            setNodeSelected({ ...res, key: res._id });
            return;
        }

        if (node && node.paragraph) {
            const res = await findParagraph(node.key);
            setNodeSelected({ ...res, key: res._id });
            return;
        }
    };

    const selectTitle = async () => {
        setContent(null);
        setNodeSelected(null);
        const res = await findDocument(document._id);
        setNodeSelected({ key: res._id, label: res.name, document: true, content: res.title });
    };

    //Events to quill

    useEffect(() => {
        // Save in API when the user stops typing
        const delayDebounceFn = setTimeout(async () => {
            if (nodeSelected && content !== null) {
                if (nodeSelected && nodeSelected.article) {
                    await update(nodeSelected.key, { content });
                }

                if (nodeSelected && nodeSelected.paragraph) {
                    await updateParagraph(nodeSelected.key, { content });
                }

                if (nodeSelected && nodeSelected.document) {
                    updateDocument(document._id, { title: content });
                    return;
                }
            }
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [content]);

    return (
        <section className="grid">
            <Toast ref={toast} />
            <DeleteEditorModal state={openModalClose} setState={(e) => setOpenModalClose(e)} remove={() => deleteNode()} />
            <div className="col-12 lg:col-3">
                <h5 className="m-0">{document?.name}</h5>

                <div className="mt-2 mb-2 cursor-pointer text-blue-500 font-bold" onClick={() => selectTitle()}>
                    Título
                </div>

                <div className="mb-2 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                    <i className="pi pi-plus-circle mr-1"></i> Agregar Capítulo
                </div>

                <div>
                    <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className={`w-full pl-0 ${styles['tree']}`} />
                </div>
            </div>

            {nodeSelected && modules ? (
                <div className="grid col-12 lg:col-9">
                    <div className="col-12 lg:col-6">
                        <EditorToolbar />
                        <ReactQuill theme="snow" formats={formats} ref={quill} value={content ?? nodeSelected.content} modules={modules} onChange={(e) => setContent(e)} />
                    </div>
                    <div className="col-12 lg:col-6 ql-editor">
                        <div className={`shadow-1 p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(content ?? nodeSelected.content, variables) }}></div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </section>
    );
}
