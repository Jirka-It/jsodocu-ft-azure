import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import ReactQuill from 'react-quill';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';

import { Button } from 'primereact/button';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { INode, INodeGeneral } from '@interfaces/INode';
import { IDocument } from '@interfaces/IDocument';

import { IVariableLight } from '@interfaces/IVariable';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { State } from '@enums/DocumentEnum';
import DeleteEditorModal from '@components/Modals/DeleteEditorModal';
import CommentModal from '@components/Modals/CommentModal';

import { findAllWithOutPagination } from '@api/variables';
import { findAll as findAllChapters, create } from '@api/chapters';
import { findById as findParagraph, update as updateParagraph } from '@api/paragraphs';
import { findByIdLight, findByIdLight as findDocument, update as updateDocument } from '@api/documents';
import { findById, update } from '@api/articles';

import { count, replaceText } from '@lib/ReplaceText';
import { addSection, deleteSection, handleChangeEvent, handleEditorClick, updateApprove, updateComments } from '@lib/Editor';
import { showError, showSuccess } from '@lib/ToastMessages';

import EditorToolbar, { formats } from './EditorToolbar';

import styles from './Editor.module.css';
import 'react-quill/dist/quill.snow.css';
import FileModal from '@components/Modals/FileModal';

export default function Editor({ inReview }) {
    const toast = useRef(null);
    const quill = useRef(null);
    const params = useParams();
    const [timer, setTimer] = useState(null);
    const [doc, setDoc] = useState<IDocument>(null);
    const [nodes, setNodes] = useState<Array<INode>>();
    const [modules, setModules] = useState<any>(null);

    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const [comment, setComment] = useState<string>('');
    const [newRange, setNewRange] = useState();

    const [openModalComment, setOpenModalComment] = useState<boolean>(false);

    const [variables, setVariables] = useState<Array<IVariableLight>>([]);
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [content, setContent] = useState<string>(null);
    const [inputClicked, setInputClicked] = useState<boolean>(false);

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
                    quillRef.root.addEventListener('click', (e) => handleEditorClick(quill, openComment, e));

                    return () => {
                        quillRef.root.removeEventListener('click', (e) => handleEditorClick(quill, openComment, e));
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

    //Quill functions

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
            // This code is to change the name by the value and vice versa, cuz the mentions
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
                    comment: () => {
                        setOpenModalComment(true);
                    }
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
                <div className="p-inputgroup flex h-2rem">
                    {(node.article && (doc?.step === State.REVIEW || doc?.step === State.EDITION)) || node.count > 0 ? (
                        <>
                            {node.count > 0 && !node.approved ? (
                                <>
                                    <Tooltip target=".count-badge-article" />{' '}
                                    <Badge
                                        className={`mr-1 cursor-pointer border-circle count-badge-article ${styles['badge-input']}`}
                                        value=""
                                        data-pr-tooltip={`${node.count} comentarios`}
                                        data-pr-position="right"
                                        data-pr-at="right+5 top"
                                        data-pr-my="left center-2"
                                        severity="danger"
                                    ></Badge>
                                </>
                            ) : (
                                <>
                                    {node.approved ? (
                                        <>
                                            <Tooltip target=".count-badge-article" />

                                            <Badge
                                                className={`mr-1 cursor-pointer count-badge-article border-circle ${styles['badge-input']}`}
                                                data-pr-tooltip="Elemento aprobado"
                                                data-pr-position="right"
                                                data-pr-at="right+5 top"
                                                data-pr-my="left center-2"
                                                value=""
                                                severity="success"
                                            ></Badge>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        ''
                    )}

                    <InputText
                        tooltip={node.value}
                        onClick={() => handleClickEvent(node.chapter ? null : node)}
                        value={node.value}
                        onChange={(e) => handleChangeEvent(node, e.target.value, setNodes, timer, setTimer, doc)}
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
                        <span className="flex">
                            {doc?.step === State.REVIEW || doc?.step === State.EDITION || node.count > 0 ? (
                                <>
                                    {node.count > 0 && !node.approved ? (
                                        <>
                                            <Tooltip target=".count-badge-paragraph" />
                                            <Badge
                                                className={`mr-1 cursor-pointer border-circle count-badge-paragraph ${styles['badge-input-paragraph']}`}
                                                value=""
                                                data-pr-tooltip={`${node.count} comentarios`}
                                                data-pr-position="right"
                                                data-pr-at="right+5 top"
                                                data-pr-my="left center-2"
                                                severity="danger"
                                            ></Badge>
                                        </>
                                    ) : (
                                        <>
                                            {node.approved ? (
                                                <>
                                                    <Tooltip target=".count-badge-paragraph" />

                                                    <Badge
                                                        data-pr-tooltip="Elemento aprobado"
                                                        data-pr-position="right"
                                                        data-pr-at="right+5 top"
                                                        data-pr-my="left center-2"
                                                        className={`mr-1 cursor-pointer count-badge-paragraph border-circle ${styles['badge-input-paragraph']}`}
                                                        value=""
                                                        severity="success"
                                                    ></Badge>
                                                </>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                ''
                            )}

                            <h6 className={`m-0 cursor-pointer ${styles['custom-label']}`} onClick={() => handleClickEvent(node)}>
                                {node.label}
                            </h6>
                        </span>

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
            setNodes((prevArray) => [...prevArray, { ...res, key: res._id }]);
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
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        setInputClicked(true);
        setNodeSelected(null);
        if (node && node.article) {
            const res = await findById(node.key);
            setNodeSelected({ ...res, key: res._id });
            setContent(res.content);
            return;
        }

        if (node && node.paragraph) {
            const res = await findParagraph(node.key);
            setNodeSelected({ ...res, key: res._id });
            setContent(res.content);
            return;
        }
    };

    const selectTitle = async () => {
        setInputClicked(true);
        setNodeSelected(null);
        const res = await findDocument(doc._id);
        setNodeSelected({ key: res._id, label: res.name, document: true, content: res.title });
        setContent(res.title);
    };

    const handleApprove = async (nodeSelected: INodeGeneral, state: boolean) => {
        if (state) {
            const countComment = count(content);

            if (countComment > 0) {
                showError(toast, '', 'Tienes comentarios');
                return;
            }
        }
        if (nodeSelected && nodeSelected.article) {
            updateApprove(nodeSelected, setNodes, state);
            await update(nodeSelected.key, { approved: state });
            setNodeSelected({ ...nodeSelected, approved: state });
        }
        if (nodeSelected && nodeSelected.paragraph) {
            updateApprove(nodeSelected, setNodes, state);
            await updateParagraph(nodeSelected.key, { approved: state });
            setNodeSelected({ ...nodeSelected, approved: state });
        }
        if (nodeSelected && nodeSelected.document) {
            setDoc({ ...doc, approved: state });
            await updateDocument(doc._id, { approved: state });
            setNodeSelected({ ...nodeSelected, approved: state });
        }
    };

    //Events to quill

    const updateContent = async (content: string, permit: boolean = false) => {
        const countComment = count(content);
        updateComments(nodeSelected, countComment, setNodes);
        setContent(content);
        clearTimeout(timer);
        if (doc && doc.step === State.APPROVED) {
            return;
        }

        const newTimer = setTimeout(async () => {
            if (nodeSelected && (!inputClicked || permit)) {
                if (nodeSelected && nodeSelected.article) {
                    const res = await update(nodeSelected.key, { content, count: countComment });
                    setNodeSelected({ ...res, key: res._id });
                    return;
                }

                if (nodeSelected && nodeSelected.paragraph) {
                    const res = await updateParagraph(nodeSelected.key, { content, count: countComment });
                    setNodeSelected({ ...res, key: res._id });
                    return;
                }

                if (nodeSelected && nodeSelected.document) {
                    setDoc({ ...doc, count: countComment });
                    const res = await updateDocument(doc._id, { title: content, count: countComment });
                    setNodeSelected({ key: res._id, label: res.name, document: true, content: res.title });
                    return;
                }
            }
        }, 1000);

        setTimer(newTimer);
    };

    //Events to add comments

    const openComment = async (comment: string, range) => {
        setComment(comment);
        setNewRange(range);
        setOpenModalComment(true);
    };

    return (
        <section className="grid">
            <Toast ref={toast} />
            {quill ? (
                <CommentModal
                    state={openModalComment}
                    setState={(e) => setOpenModalComment(e)}
                    toast={toast}
                    quill={quill}
                    comment={comment}
                    newRange={newRange}
                    setComment={(e) => setComment(e)}
                    updateContent={() => {
                        setComment(null);
                        setNewRange(null);
                    }}
                />
            ) : (
                ''
            )}
            {openModal && nodeSelected ? <FileModal state={openModal} toast={toast} data={nodeSelected} setState={(e) => setOpenModal(e)} /> : ''}
            <DeleteEditorModal state={openModalClose} setState={(e) => setOpenModalClose(e)} remove={() => deleteNode()} />

            <div className="col-12 lg:col-3">
                <h5 className="m-0">{doc?.name}</h5>
                <p className="m-0 text-blue-500">{doc?.type?.name}</p>

                <div className="mt-2 mb-2 flex align-items-center cursor-pointer" onClick={() => selectTitle()}>
                    {inReview || doc?.count > 0 ? (
                        <>
                            {doc?.count > 0 && !doc?.approved ? (
                                <>
                                    <Tooltip target=".count-badge-title" />
                                    <Badge className="mr-1 cursor-pointer count-badge-title" data-pr-tooltip={`${doc?.count} comentarios`} data-pr-position="right" data-pr-at="right+5 top" data-pr-my="left center-2" severity="danger"></Badge>
                                </>
                            ) : (
                                <>{doc?.approved ? <Badge className="mr-1 cursor-pointer border-circle" value="" severity="success"></Badge> : ''}</>
                            )}
                        </>
                    ) : (
                        ''
                    )}
                    <h6 className="m-0 text-blue-500 font-bold">Título</h6>
                </div>

                {/*Only add chapters when the doc is in edition */}
                {doc?.step === State.EDITION ? (
                    <div className="mb-2 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                        <i className="pi pi-plus-circle mr-1"></i> Agregar Capítulo
                    </div>
                ) : (
                    ''
                )}

                {doc && nodes && nodes.length > 0 ? (
                    <div className="editor-tree">
                        <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className={`w-full pl-0 ${styles['tree']}`} />
                    </div>
                ) : (
                    ''
                )}
            </div>

            {modules && nodeSelected ? (
                <>
                    <div className="col-12 lg:col-9 text-center">
                        <div className="flex justify-content-between">
                            <Tooltip target=".count-badge-docs" />

                            <h6 className="text-blue-500 font-bold">{nodeSelected.document ? 'Titulo' : nodeSelected.value}</h6>
                            {/*Only in articles and paragraphs */}
                            {doc.template === false && (nodeSelected.article || nodeSelected.paragraph) ? (
                                <i className="pi pi-folder-open p-overlay-badge count-badge-docs cursor-pointer mr-2" data-pr-position="left" data-pr-tooltip="Cargar documentos" onClick={() => setOpenModal(true)} style={{ fontSize: '2rem' }}>
                                    <Badge value={nodeSelected.files ? nodeSelected.files.length : 0}></Badge>
                                </i>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="grid">
                            <div className="col-12 lg:col-6">
                                <EditorToolbar inReview={inReview} />
                                <ReactQuill
                                    theme="snow"
                                    onFocus={() => setInputClicked(false)}
                                    formats={formats}
                                    ref={quill}
                                    value={content}
                                    modules={modules}
                                    readOnly={nodeSelected.approved || doc.step === State.APPROVED}
                                    onChange={(e) => updateContent(e)}
                                />
                            </div>

                            <div className="col-12 lg:col-6 ql-editor">
                                <div className={`shadow-1 p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(content, variables) }}></div>
                            </div>
                        </div>

                        {inReview && nodeSelected && !nodeSelected.approved && doc.step !== State.APPROVED && !openModal ? (
                            <Button label="Aprobar" onClick={() => handleApprove(nodeSelected, true)} className={`${styles['button-approve']}`} severity="help" />
                        ) : (
                            ''
                        )}

                        {inReview && nodeSelected && nodeSelected.approved && doc.step !== State.APPROVED && !openModal ? (
                            <Button label="Re-abrir" onClick={() => handleApprove(nodeSelected, false)} className={`${styles['button-approve']} text-white`} severity="warning" />
                        ) : (
                            ''
                        )}
                    </div>
                </>
            ) : (
                ''
            )}
        </section>
    );
}
