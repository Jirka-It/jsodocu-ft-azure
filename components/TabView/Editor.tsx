import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { Editor as Quill } from 'primereact/editor';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import Mention from 'quill-mention';
import { INode, INodeGeneral } from '@interfaces/INode';

import { findAll } from '@api/variables';
import { findAll as findAllChapters, create } from '@api/chapters';
import { replaceText } from '@lib/ReplaceText';
import { addSection, deleteSection, handleChangeEvent } from '@lib/Editor';

import styles from './Editor.module.css';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showSuccess } from '@lib/ToastMessages';

export default function Editor() {
    const toast = useRef(null);
    const params = useParams();
    const [nodes, setNodes] = useState<Array<INode>>();
    const [timer, setTimer] = useState(null);
    const [content, setContent] = useState<string>('');
    const [data, setData] = useState<Array<any>>();
    const [nodeSelected, setNodeSelected] = useState<INodeGeneral>();
    const [expandedKeys, setExpandedKeys] = useState<any>({ '0': true, '0-0': true });

    useEffect(() => {
        getChapters();
    }, []);

    const getChapters = async () => {
        const res = await findAllChapters({ documentId: params.id });
        setNodes(res.data);
    };

    const quillLoaded = (event) => {
        const quillInstance = event;

        new Mention(quillInstance, {
            mentionDenotationChars: ['@'],
            source: async (searchTerm: string, renderList: (data: any, searchText: string) => void, mentionChar: string) => {
                // sample data set for displaying
                // enter your logic here
                // Apply a logic to reduce the call to API

                const res = await findAll({ page: 1, size: 10, documentId: params.id, searchParam: searchTerm });
                const data = res.data;

                if (data) {
                    data.map((r) => {
                        const name = r.name;
                        const value = r.value;
                        (r.name = value), (r.value = name);
                        return r;
                    });
                }

                setData(data);
                renderList(data, searchTerm);
            }
        });
    };

    const nodeTemplate = (node, options) => {
        let label = <b>{node.label}</b>;

        if (node.chapter || node.article) {
            label = (
                <div>
                    <div>
                        <div className="flex justify-content-between">
                            <h6 className="m-0 cursor-pointer" onClick={() => handleClickEvent(node.chapter ? null : node)}>
                                {node.label}
                            </h6>
                            <div>
                                {/*<i className="pi pi-save cursor-pointer" onClick={() => saveSection(node)} title="Guardar"></i> */}
                                <i className="pi pi-plus cursor-pointer ml-2" onClick={() => addSection(node, setNodes)} title={node.chapter ? 'Agregar artículo' : 'Agregar paragrafo'}></i>
                                <i className="pi pi-times cursor-pointer ml-2" onClick={() => deleteSection(node, setNodes)} title="Borrar"></i>
                            </div>
                        </div>

                        <InputText value={node.value} onChange={(e) => handleChangeEvent(node, e.target.value, setNodes, timer, setTimer)} className="w-full" type="text" placeholder={node.chapter ? 'Nombre del capítulo' : 'Nombre del artículo'} />
                    </div>
                </div>
            );
        }

        if (node.paragraph) {
            label = (
                <div>
                    <div className="flex align-items-center justify-content-between	">
                        <h6 className="m-0 cursor-pointer" onClick={() => handleClickEvent(node)}>
                            {node.label}
                        </h6>
                        <div>
                            <i className="pi pi-times cursor-pointer ml-2" onClick={() => deleteSection(node, setNodes)} title="Borrar"></i>
                        </div>
                    </div>
                </div>
            );
        }

        return <span className={options.className}>{label}</span>;
    };

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

    const saveSection = (node: INodeGeneral) => {
        //I will delete this function cuz, we will do autosave
        console.log('saveSection', node);
    };

    const handleClickEvent = (node: INodeGeneral) => {
        setNodeSelected(node);
        setContent(null);
    };

    //Events to quill

    useEffect(() => {
        // Save in API when the user stops typing
        const delayDebounceFn = setTimeout(() => {
            if (nodeSelected && content) {
                console.log('Call to API', nodeSelected);
                console.log('html', content);
            }
            // Send Axios request here
        }, 700);

        return () => clearTimeout(delayDebounceFn);
    }, [content]);

    const saveContent = (html: string) => {
        setContent(html);
    };

    return (
        <section className="grid">
            <Toast ref={toast} />
            <div className="col-12 lg:col-3">
                <h4 className="m-0">Conjunto Amatista</h4>
                <h6 className="m-0 text-gray-500 mb-5">Reglamento PH</h6>
                <div className="mb-5 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                    <i className="pi pi-plus-circle mr-3"></i> Agregar Capítulo
                </div>

                <div>
                    <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className="w-full" />
                </div>
            </div>

            {nodeSelected ? (
                <div className="grid col-12 lg:col-9">
                    <div className="col-12 lg:col-6">
                        <Quill value={content} onTextChange={(e) => saveContent(e.htmlValue)} style={{ minHeight: '30rem' }} onLoad={quillLoaded} />
                    </div>
                    <div className="col-12 lg:col-6 ql-editor">
                        <div className={`shadow-1 h-full p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(content, data) }}></div>
                    </div>
                </div>
            ) : (
                ''
            )}
        </section>
    );
}
