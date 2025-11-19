import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';

import { INode, INodeGeneral } from '@interfaces/INode';
import { IDocument } from '@interfaces/IDocument';
import { IVariableLight } from '@interfaces/IVariable';

import { findAllWithOutPagination } from '@api/variables';
import { findAll as findAllChapters } from '@api/chapters';
import { findById as findParagraph } from '@api/paragraphs';
import { docToTemplate, findByIdLight, templateToDoc } from '@api/documents';
import { findById } from '@api/articles';

import { replaceText } from '@lib/ReplaceText';
import { handleChangeEvent } from '@lib/Editor';
import { showError, showSuccess } from '@lib/ToastMessages';
import { addInEdition } from '@store/slices/menuSlices';

import FileModal from '@components/Modals/FileModal';

import styles from './Editor.module.css';
import 'react-quill/dist/quill.snow.css';

export default function Review() {
    const params = useParams();
    const dispatch = useDispatch();
    const toast = useRef(null);
    
    const [timer, setTimer] = useState(null);
    const [doc, setDoc] = useState<IDocument>(null);
    const [nodes, setNodes] = useState<Array<INode>>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [variables, setVariables] = useState<Array<IVariableLight>>([]);
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [content, setContent] = useState<string>(null);
    const [expandedKeys, setExpandedKeys] = useState<any>({});

    useEffect(() => {
        initializeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Initialize all required data for the component
     */
    const initializeData = async () => {
        try {
            await Promise.all([
                getChapters(),
                getVariables(),
                getDocument()
            ]);
        } catch (error) {
            console.error('Error inicializando datos:', error);
            showError(toast, '', 'Error cargando datos del documento');
        }
    };

    const getDocument = async () => {
        const res = await findByIdLight(params.id);
        setDoc(res);
    };

    /**
     * Fetch chapters and build expanded keys for tree view
     */
    const getChapters = async () => {
        const res = await findAllChapters({ documentId: params.id });
        
        if (res?.data) {
            const keys = res.data.reduce((acc, chapter) => {
                acc[chapter.key] = true;
                return acc;
            }, {});
            
            setExpandedKeys(keys);
            setNodes(res.data);
        }
    };

    const getVariables = async () => {
        const res = await findAllWithOutPagination({ documentId: params.id });
        const data = res.data;

        if (data) {
            const processedVariables = data.map(variable => ({
                ...variable,
                name: variable.value,
                value: variable.name
            }));
            
            setVariables(processedVariables);
        }
    };

    /**
     * Custom node template for Tree component
     */
    const nodeTemplate = (node, options) => {
        let label;

        if (node.chapter || node.article) {
            label = (
                <div className="p-inputgroup flex h-2rem">
                    <InputText
                        id={node._id}
                        readOnly={true}
                        onClick={() => handleNodeClick(node.chapter ? null : node)}
                        value={node.value}
                        onChange={(e) => handleChangeEvent(
                            node, 
                            e.target.value, 
                            setNodes, 
                            timer, 
                            setTimer, 
                            doc
                        )}
                        className={`${styles['input-node']} w-full`}
                        type="text"
                        placeholder={node.chapter ? 'Capítulo' : 'Artículo'}
                    />
                </div>
            );
        } else if (node.paragraph) {
            label = (
                <div>
                    <div className="flex align-items-center justify-content-between h-2rem">
                        <span className="flex">
                            <h6 
                                className={`m-0 cursor-pointer ${styles['custom-label']}`} 
                                onClick={() => handleNodeClick(node)}
                            >
                                {node.label}
                            </h6>
                        </span>
                    </div>
                </div>
            );
        } else {
            label = <b>{node.label}</b>;
        }

        return <span className={options.className}>{label}</span>;
    };

    /**
     * Handle node selection in the tree
     */
    const handleNodeClick = async (node: INodeGeneral) => {
        if (!node) {
            setNodeSelected(null);
            return;
        }

        try {
            let selectedNode: INodeGeneral;
            let nodeContent: string;

            if (node.article) {
                const res = await findById(node.key);
                selectedNode = { ...res, key: res._id };
                nodeContent = res.content;
            } else if (node.paragraph) {
                const res = await findParagraph(node.key);
                selectedNode = { ...res, key: res._id };
                nodeContent = res.content;
            }

            setNodeSelected(selectedNode);
            setContent(nodeContent);
        } catch (error) {
            console.error('Error cargando contenido del nodo:', error);
            showError(toast, '', 'Error cargando contenido');
        }
    };

    const selectTitle = async () => {
        if (!doc) return;
        
        setNodeSelected({ 
            key: doc._id, 
            label: doc.name, 
            document: true, 
            content: doc.title 
        });
        setContent(doc.title);
    };

    /**
     * Convert document to template or template to document
     */
    const convertDocument = async (document: IDocument) => {
        if (!document) return;

        try {
            if (document?.template) {
                await templateToDoc(document._id);
                dispatch(addInEdition());
                showSuccess(toast, '', `Documento ${document.name} creado`);
            } else {
                await docToTemplate(document._id);
                showSuccess(toast, '', `Plantilla ${document.name} creada`);
            }
        } catch (error) {
            console.error('Error convirtiendo documento:', error);
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <section className="grid">
            <Toast ref={toast} />
            
            {/* Sidebar - Navegación del árbol */}
            <div className="col-12 lg:col-3">
                <div className="mb-4">
                    <h5 className="m-0">{doc?.name}</h5>
                    <p className="m-0 text-blue-500">{doc?.type?.name}</p>
                </div>

                {/* Selección de título del documento */}
                <div 
                    className="mt-2 mb-2 flex align-items-center cursor-pointer text-blue-500 font-bold" 
                    onClick={selectTitle}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && selectTitle()}
                >
                    Título
                </div>

                {/* Componente Tree */}
                {nodes?.length > 0 && (
                    <Tree 
                        value={nodes} 
                        nodeTemplate={nodeTemplate} 
                        expandedKeys={expandedKeys} 
                        onToggle={(e) => setExpandedKeys(e.value)} 
                        className={`w-full pl-0 ${styles['tree']}`} 
                    />
                )}
            </div>

            {/* Área de contenido principal */}
            {nodeSelected && (
                <section className="col-12 lg:col-9 text-center">
                    {/* Header con título y badge de archivos */}
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h6 className="text-blue-500 font-bold">
                            {nodeSelected.document ? 'Título' : nodeSelected.value}
                        </h6>
                        
                        {/* Badge de archivos adjuntos para artículos y párrafos */}
                        {!doc?.template && (nodeSelected.article || nodeSelected.paragraph) && (
                            <i 
                                className="pi pi-folder-open p-overlay-badge count-badge-docs cursor-pointer mr-2 mb-2" 
                                data-pr-position="left" 
                                data-pr-tooltip="Cargar documentos" 
                                onClick={() => setOpenModal(true)} 
                                style={{ fontSize: '2rem' }}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && setOpenModal(true)}
                            >
                                <Badge value={nodeSelected.files?.length || 0} />
                            </i>
                        )}
                    </div>

                    {/* Visualización de contenido */}
                    <div className="ql-editor p-0">
                        <div 
                            className={`shadow-1 p-4 ${styles['div-editor-html']}`} 
                            dangerouslySetInnerHTML={{ 
                                __html: replaceText(content, variables) 
                            }} 
                        />
                    </div>

                    {/* Botón de conversión de plantilla */}
                    {!openModal && (
                        <Button 
                            onClick={() => convertDocument(doc)} 
                            className={`${styles['button-template']} ${
                                doc?.template ? '' : 'w-18rem'
                            } font-bold`} 
                            severity="help"
                        >
                            {doc?.template ? (
                                'Utilizar Plantilla'
                            ) : (
                                <div>
                                    <p className="m-0">Convertir en plantilla</p>
                                    <p className="m-0 text-xs">
                                        Este documento será la base para la elaboración de otros documentos
                                    </p>
                                </div>
                            )}
                        </Button>
                    )}
                </section>
            )}

            {/* Modal de archivos */}
            {openModal && nodeSelected && (
                <FileModal 
                    state={openModal} 
                    toast={toast} 
                    data={nodeSelected} 
                    setState={setOpenModal} 
                />
            )}
        </section>
    );
}