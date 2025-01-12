import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { INode, INodeGeneral } from '@interfaces/INode';
import { IDocument } from '@interfaces/IDocument';

import { IVariableLight } from '@interfaces/IVariable';

import { findAllWithOutPagination } from '@api/variables';
import { findAll as findAllChapters } from '@api/chapters';
import { findById as findParagraph } from '@api/paragraphs';
import { findByIdLight } from '@api/documents';
import { findById } from '@api/articles';

import { replaceText } from '@lib/ReplaceText';
import { handleChangeEvent } from '@lib/Editor';

import styles from './Editor.module.css';
import 'react-quill/dist/quill.snow.css';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export default function Review() {
    const params = useParams();
    const [timer, setTimer] = useState(null);
    const [doc, setDoc] = useState<IDocument>(null);
    const [nodes, setNodes] = useState<Array<INode>>();

    const [variables, setVariables] = useState<Array<IVariableLight>>([]);
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [content, setContent] = useState<string>(null);

    const [expandedKeys, setExpandedKeys] = useState<any>();

    useEffect(() => {
        getChapters();
        getVariables();
        getDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            // This code is to change the name by the value and vice versa
            data.map((r) => {
                const name = r.name;
                const value = r.value;
                (r.name = value), (r.value = name);
                return r;
            });
        }

        setVariables(data);
    };

    // Event to load tree

    const nodeTemplate = (node, options) => {
        let label = <b>{node.label}</b>;

        if (node.chapter || node.article) {
            label = (
                <div className="p-inputgroup flex h-2rem">
                    <InputText
                        readOnly={true}
                        onClick={() => handleClickEvent(node.chapter ? null : node)}
                        value={node.value}
                        onChange={(e) => handleChangeEvent(node, e.target.value, setNodes, timer, setTimer, doc)}
                        className={`${styles['input-node']} w-full`}
                        type="text"
                        placeholder={node.chapter ? 'Capítulo' : 'Artículo'}
                    />
                </div>
            );
        }

        if (node.paragraph) {
            label = (
                <div>
                    <div className="flex align-items-center justify-content-between h-2rem">
                        <span className="flex">
                            <h6 className={`m-0 cursor-pointer ${styles['custom-label']}`} onClick={() => handleClickEvent(node)}>
                                {node.label}
                            </h6>
                        </span>
                    </div>
                </div>
            );
        }

        return <span className={options.className}>{label}</span>;
    };

    //Button events tree

    const selectTitle = async () => {
        setNodeSelected(null);
        setNodeSelected({ key: doc._id, label: doc.name, document: true, content: doc.title });
        setContent(doc.title);
    };

    const handleClickEvent = async (node: INodeGeneral) => {
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

    return (
        <section className="grid">
            <div className="col-12 lg:col-3">
                <h5 className="m-0">{doc?.name}</h5>

                <div className="mt-2 mb-2 flex align-items-center cursor-pointer text-blue-500 font-bold" onClick={() => selectTitle()}>
                    Título
                </div>

                {nodes && nodes.length > 0 ? (
                    <div>
                        <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className={`w-full pl-0 ${styles['tree']}`} />
                    </div>
                ) : (
                    ''
                )}
            </div>

            {nodeSelected ? (
                <section className="col-12 lg:col-9">
                    <div className="ql-editor">
                        <div className={`shadow-1 p-4 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(content, variables) }}></div>
                    </div>
                    {nodeSelected ? (
                        <Button onClick={() => console.log('M')} className={`${styles['button-template']} font-bold w-18rem`} severity="help">
                            {doc?.template ? (
                                'Utilizar Plantilla'
                            ) : (
                                <div>
                                    <p className="m-0">Convertir en plantilla</p>
                                    <p className="m-0 text-xs">Este documento sera la base para la elaboración de otros documentos</p>
                                </div>
                            )}
                        </Button>
                    ) : (
                        ''
                    )}
                </section>
            ) : (
                ''
            )}
        </section>
    );
}
