import { useEffect, useRef, useState, createElement } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import ReactQuill from 'react-quill';
import { Badge } from 'primereact/badge';

import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { INode, INodeGeneral } from '@interfaces/INode';
import { IVariableLight } from '@interfaces/IVariable';
import { count, replaceComment, replaceText } from '@lib/ReplaceText';
import { addSection, deleteSection, handleChangeEvent, updateComments } from '@lib/Editor';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showSuccess } from '@lib/ToastMessages';
import { findById, update } from '@api/articles';
import DeleteEditorModal from '@components/Modals/DeleteEditorModal';
import EditorToolbar, { formats } from './EditorToolbar';

import { findAllWithOutPagination } from '@api/variables';
import { findAll as findAllChapters, create } from '@api/chapters';
import { findById as findParagraph, update as updateParagraph } from '@api/paragraphs';
import { findByIdLight, findByIdLight as findDocument, update as updateDocument } from '@api/documents';

import styles from './Editor.module.css';
import 'react-quill/dist/quill.snow.css';
import { IDocument } from '@interfaces/IDocument';

export default function Editor({ inReview }) {
    const toast = useRef(null);
    const quill = useRef(null);
    const params = useParams();
    const [timer, setTimer] = useState(null);
    const [doc, setDoc] = useState<IDocument>(null);
    const [nodes, setNodes] = useState<Array<INode>>();
    const [modules, setModules] = useState<any>(null);

    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [variables, setVariables] = useState<Array<IVariableLight>>([]);
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [nodeSelectedToDelete, setNodeSelectedToDelete] = useState<INodeGeneral>(null);
    const [expandedKeys, setExpandedKeys] = useState<any>();

    useEffect(() => {
        getChapters();
        getVariables();
        getDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (nodeSelected) {
            if (typeof window !== 'undefined') {
                if (quill.current) {
                    const quillRef = quill.current.getEditor(); // Get the Quill instance
                    quillRef.root.addEventListener('click', handleEditorClick);

                    return () => {
                        quillRef.root.removeEventListener('click', handleEditorClick);
                    };
                }
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modules, nodeSelected]);

    const getDocument = async () => {
        const res = await findByIdLight(params.id);
        setDoc(res);
    };

    const handleEditorClick = (e) => {
        const quillRef = quill.current.getEditor(); // Get Quill instance
        const clickedElement = e.target; // Element clicked on
        const quillRoot = quillRef.root; // Quill's root DOM node

        if (quillRoot.contains(clickedElement)) {
            // Check if the clicked element is an image, link, or custom element
            if (clickedElement.tagName === 'COMMENT') {
                var text = clickedElement.innerText || clickedElement.textContent;
                // Replace the <img> with a <div> or any other tag you need
                const newElement = document.createElement('div');
                newElement.innerHTML = `<p>${text}</p>`; // Customize content

                const newBody = replaceComment(quill.current.value, clickedElement.outerHTML, text);
                setNodeSelected({ ...nodeSelected, content: newBody });
                updateContent(newBody);
            }
        }
    };

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
                    quill.current.editor.formatText(range.index, range.length, 'customTag', prompt);
                }
            } else {
                alert('Editor no seleccionado');
            }
        }
    };

    // Get data and quill's modules
    const getChapters = async () => {
        const res = await findAllChapters({ documentId: params.id });
        const keys: {} = {};

        if (res && res.data) {
            res.data.map((c) => {
                keys[c.key] = true;
            });

            setExpandedKeys(keys);
            setNodes(res.data);
        }
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
                <div className="p-inputgroup flex-1  h-2rem">
                    {node.article ? <Badge className="mr-1 cursor-pointer border-circle" value={node.count ?? 0} severity="danger"></Badge> : ''}

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
                        <Badge className="mr-1 cursor-pointer border-circle" value={node.count ?? 0} severity="danger"></Badge>
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
        await deleteSection(nodeSelectedToDelete, setNodes);
        setNodeSelectedToDelete(null);
        setOpenModalClose(!openModalClose);
    };

    const handleClickEvent = async (node: INodeGeneral) => {
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
        setNodeSelected(null);
        const res = await findDocument(doc._id);
        setNodeSelected({ key: res._id, label: res.name, document: true, content: res.title });
    };

    //Events to quill

    const updateContent = async (content: string) => {
        const countComment = count(content);
        setNodeSelected({ ...nodeSelected, content });
        updateComments(nodeSelected, countComment, setNodes);

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            if (nodeSelected) {
                if (nodeSelected && nodeSelected.article) {
                    await update(nodeSelected.key, { content, count: countComment });
                    return;
                }

                if (nodeSelected && nodeSelected.paragraph) {
                    await updateParagraph(nodeSelected.key, { content, count: countComment });
                    return;
                }

                if (nodeSelected && nodeSelected.document) {
                    setDoc({ ...doc, count: countComment });
                    await updateDocument(doc._id, { title: content, count: countComment });
                    return;
                }
            }
        }, 1000);

        setTimer(newTimer);
    };

    return (
        <section className="grid">
            <Toast ref={toast} />
            <DeleteEditorModal state={openModalClose} setState={(e) => setOpenModalClose(e)} remove={() => deleteNode()} />
            <div className="col-12 lg:col-3">
                <h5 className="m-0">{doc?.name}</h5>

                <div className="mt-2 mb-2 flex align-items-center cursor-pointer text-blue-500 font-bold" onClick={() => selectTitle()}>
                    <Badge className="mr-1 cursor-pointer" value={doc?.count ?? 0} severity="danger"></Badge>
                    Título
                </div>

                <div className="mb-2 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                    <i className="pi pi-plus-circle mr-1"></i> Agregar Capítulo
                </div>

                <div>
                    <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className={`w-full pl-0 ${styles['tree']}`} />
                </div>
            </div>

            {modules && nodeSelected ? (
                <div className="grid col-12 lg:col-9">
                    <div className="col-12 lg:col-6">
                        <EditorToolbar inReview={inReview} />
                        <ReactQuill theme="snow" formats={formats} ref={quill} value={nodeSelected?.content} modules={modules} onChange={(e) => updateContent(e)} />
                    </div>
                    <div className="col-12 lg:col-6 ql-editor">
                        <div className={`shadow-1 p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(nodeSelected?.content, variables) }}></div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </section>
    );
}
