import { Editor as Quill } from 'primereact/editor';
import Mention from 'quill-mention';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from './Editor.module.css';
import { treeNodes } from '@lib/data';
import { Tree } from 'primereact/tree';
import { replaceText } from '@lib/ReplaceText';
import { INode, INodeGeneral } from '@interfaces/INode';

const data = [
    { id: 1, value: 'variable_PH', variable: 'Partha' },

    { id: 2, value: 'date_contract', variable: 'Emma' }
];

export default function Editor() {
    const [sections, setSections] = useState([]);
    const [nodes, setNodes] = useState<Array<INode>>(treeNodes);

    const [contentSelected, setContentSelected] = useState<number>();
    const [expandedKeys, setExpandedKeys] = useState<any>({ '0': true, '0-0': true });

    //Events to quill
    const quillLoaded = (event) => {
        const quillInstance = event;

        new Mention(quillInstance, {
            mentionDenotationChars: ['@'],
            source: function (searchTerm: string, renderList: (data: any, searchText: string) => void, mentionChar: string) {
                // sample data set for displaying
                // enter your logic here

                renderList(data, searchTerm);
            }
        });
    };

    //Inputs functions

    const handleChangeEvent = (node: INodeGeneral, content: string) => {
        if (node.chapter) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((v) => {
                    if (v.key === node.key) {
                        v['value'] = content;
                    }
                    return v;
                });
                return [...modifiedNodes];
            });
        }

        if (node.article) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((v) => {
                    if (v.key === node.OwnChapter) {
                        v.children.map((a) => {
                            if (a.key === node.key) {
                                a['value'] = content;
                            }
                            return a;
                        });
                    }

                    return v;
                });
                return [...modifiedNodes];
            });
        }
    };

    //Tree functions

    const nodeTemplate = (node, options) => {
        let label = <b>{node.label}</b>;

        if (node.chapter || node.article) {
            label = (
                <div>
                    <h6 className="m-0">{node.label}</h6>
                    <div className="flex">
                        <InputText value={node.value} onChange={(e) => handleChangeEvent(node, e.target.value)} className="w-full" type="text" placeholder={node.chapter ? 'Nombre del capítulo' : 'Nombre del artículo'} />
                        <Button icon="pi pi-save" severity="info" aria-label="Save" className="ml-2" onClick={() => saveSection(node)} tooltip="Guardar" />
                        <Button icon="pi pi-plus" severity="info" aria-label="Add" className="ml-2" onClick={() => addSection(node)} tooltip={node.chapter ? 'Agregar artículo' : 'Agregar paragrafo'} />
                        <Button icon="pi pi-times" severity="danger" aria-label="Delete" className="ml-2" onClick={() => deleteSection(node)} tooltip="Borrar" />
                    </div>
                </div>
            );
        }

        if (node.paragraph) {
            label = (
                <div>
                    <div className="flex align-items-center">
                        <h6 className="m-0">{node.label}</h6>
                        <Button icon="pi pi-save" severity="info" aria-label="Save" className="ml-2" onClick={() => saveSection(node)} tooltip="Guardar" />
                        <Button icon="pi pi-times" severity="danger" aria-label="Delete" className="ml-2" onClick={() => deleteSection(node)} tooltip="Borrar" />
                    </div>
                </div>
            );
        }

        return <span className={options.className}>{label}</span>;
    };

    const addChapter = () => {
        setNodes((prevArray) => [
            ...prevArray,
            {
                key: `${nodes.length + 1}`,
                label: `Capítulo`,
                value: '',
                chapter: true,
                children: []
            }
        ]);
    };

    const deleteSection = (node: INodeGeneral) => {
        console.log('nodes', nodes);

        // setSections((prevArray) => {
        //   const modifiedSections = prevArray.filter((v) => v.id !== idSection);
        //  return [...modifiedSections];
        // });
    };

    const saveSection = (node: INodeGeneral) => {
        console.log('saveSection', node);
    };

    const addSection = (node: INodeGeneral) => {
        if (node.chapter) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((v) => {
                    if (v.key === node.key) {
                        v.children.push({
                            key: `${v.children.length + 1}`,
                            label: 'Artículo',
                            value: '',
                            content: '',
                            OwnChapter: v.key,
                            article: true,
                            children: []
                        });
                    }

                    return v;
                });
                return [...modifiedNodes];
            });
        }

        if (node.article) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((v) => {
                    if (v.key === node.OwnChapter) {
                        v.children.map((a) => {
                            if (a.key === node.key) {
                                a.children.push({
                                    key: `${a.children.length + 1}`,
                                    OwnChapter: v.key,
                                    OwnArticle: a.key,
                                    label: 'Paragrafo',
                                    content: '',
                                    paragraph: true
                                });
                            }
                            return a;
                        });
                    }

                    return v;
                });
                return [...modifiedNodes];
            });
        }
    };

    const handleClickEvent = (id: string) => {
        setContentSelected(parseInt(id));
    };

    return (
        <section className="grid">
            <div className="col-12 lg:col-3">
                <h4 className="m-0">Conjunto Amatista</h4>
                <h6 className="m-0 text-gray-500 mb-5">Reglamento PH</h6>
                <div className="mb-5 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                    <i className="pi pi-plus-circle mr-3"></i> Agregar Capítulo
                </div>

                <div>
                    <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className="w-full md:w-30rem" />

                    {/*
                            {sections.map((s) => {
                        return (
                            <div key={s.id} className="mb-3">
                                <h5 className="m-0 mb-1 text-blue-500 font-bold cursor-pointer" onClick={() => handleClickEvent(s.id)}>
                                    Capítulo {s.id}.
                                </h5>
                                <div className="flex">
                                    <InputText value={s.chatter} onChange={(e) => handleInputChange(s.id, e.target.value)} className="w-full" type="text" placeholder="Nombre del capítulo" />
                                    <Button icon="pi pi-save" rounded severity="info" aria-label="Delete" className="ml-2" onClick={() => saveSection(s.id)} tooltip="Guardar" />
                                    <Button icon="pi pi-times" rounded severity="danger" aria-label="Delete" className="ml-2" onClick={() => deleteSection(s.id)} tooltip="Borrar" />
                                </div>
                            </div>
                        );
                    })}
                        */}
                </div>
            </div>
            {sections.map((s) => {
                return (
                    <div key={s.id} className={`grid col-12 lg:col-9 ${s.id !== contentSelected ? 'hidden' : ''}`}>
                        <div className="col-12 lg:col-6">
                            {/*                            <Quill value={s.content} onTextChange={(e) => handleChangeEvent(e.htmlValue, s)} style={{ minHeight: '30rem' }} onLoad={quillLoaded} />
                             */}
                        </div>
                        <div className="col-12 lg:col-6 ql-editor">
                            <div className={`shadow-1 h-full p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(s.content, data) }}></div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
