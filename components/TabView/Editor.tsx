import { useState } from 'react';
import { Editor as Quill } from 'primereact/editor';
import { Tree } from 'primereact/tree';
import Mention from 'quill-mention';
import { InputText } from 'primereact/inputtext';
import { treeNodes } from '@lib/data';
import { replaceText } from '@lib/ReplaceText';
import { INode, INodeGeneral } from '@interfaces/INode';
import styles from './Editor.module.css';

const data = [
    { id: 1, value: 'variable_PH', variable: 'Partha' },

    { id: 2, value: 'date_contract', variable: 'Emma' }
];

export default function Editor() {
    const [nodes, setNodes] = useState<Array<INode>>(treeNodes);
    const [content, setContent] = useState<string>('');
    const [contentSelected, setContentSelected] = useState<INodeGeneral>();
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

    //Input function

    const handleChangeEvent = (node: INodeGeneral, content: string) => {
        if (node.chapter) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.key) {
                        c['value'] = content;
                    }
                    return c;
                });
                return [...modifiedNodes];
            });
        }

        if (node.article) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.OwnChapter) {
                        c.children.map((a) => {
                            if (a.key === node.key) {
                                a['value'] = content;
                            }
                            return a;
                        });
                    }

                    return c;
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
                    <div>
                        <div className="flex justify-content-between">
                            <h6 className="m-0 cursor-pointer" onClick={() => handleClickEvent(node)}>
                                {node.label}
                            </h6>
                            <div>
                                <i className="pi pi-save cursor-pointer" onClick={() => saveSection(node)} title="Guardar"></i>
                                <i className="pi pi-plus cursor-pointer ml-2" onClick={() => addSection(node)} title={node.chapter ? 'Agregar artículo' : 'Agregar paragrafo'}></i>
                                <i className="pi pi-times cursor-pointer ml-2" onClick={() => deleteSection(node)} title="Borrar"></i>
                            </div>
                        </div>

                        <InputText value={node.value} onChange={(e) => handleChangeEvent(node, e.target.value)} className="w-full" type="text" placeholder={node.chapter ? 'Nombre del capítulo' : 'Nombre del artículo'} />
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
                            <i className="pi pi-save cursor-pointer" onClick={() => saveSection(node)} title="Guardar"></i>
                            <i className="pi pi-times cursor-pointer ml-2" onClick={() => deleteSection(node)} title="Borrar"></i>
                        </div>
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

    const addSection = (node: INodeGeneral) => {
        if (node.chapter) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.key) {
                        c.children.push({
                            key: `${c.children.length + 1}`,
                            label: 'Artículo',
                            value: '',
                            content: '',
                            OwnChapter: c.key,
                            article: true,
                            children: []
                        });
                    }

                    return c;
                });
                return [...modifiedNodes];
            });
        }

        if (node.article) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.OwnChapter) {
                        c.children.map((a) => {
                            if (a.key === node.key) {
                                a.children.push({
                                    key: `${a.children.length + 1}`,
                                    OwnChapter: c.key,
                                    OwnArticle: a.key,
                                    label: 'Paragrafo',
                                    content: '',
                                    paragraph: true
                                });
                            }
                            return a;
                        });
                    }

                    return c;
                });
                return [...modifiedNodes];
            });
        }
    };

    const deleteSection = (node: INodeGeneral) => {
        if (node.chapter) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.filter((c) => c.key !== node.key);
                return [...modifiedNodes];
            });
        }

        if (node.article) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.OwnChapter) {
                        const newArticles = c.children.filter((a) => a.key !== node.key);
                        c.children = newArticles;
                    }

                    return c;
                });
                return [...modifiedNodes];
            });
        }

        if (node.paragraph) {
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.map((c) => {
                    if (c.key === node.OwnChapter) {
                        c.children.map((a) => {
                            if (a.key === node.OwnArticle) {
                                const newParagraphs = a.children.filter((p) => p.key !== node.key);
                                a.children = newParagraphs;
                            }
                        });
                    }

                    return c;
                });
                return [...modifiedNodes];
            });
        }
    };

    const saveSection = (node: INodeGeneral) => {
        console.log('saveSection', node);
    };

    const handleClickEvent = (node: INodeGeneral) => {
        console.log('node', node);
        setContentSelected(node);
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
                    <Tree value={nodes} nodeTemplate={nodeTemplate} expandedKeys={expandedKeys} onToggle={(e) => setExpandedKeys(e.value)} className="w-full" />
                </div>
            </div>
            <div className="grid col-12 lg:col-9">
                <div className="col-12 lg:col-6">
                    <Quill value={content} onTextChange={(e) => setContent(e.htmlValue)} style={{ minHeight: '30rem' }} onLoad={quillLoaded} />
                </div>
                <div className="col-12 lg:col-6 ql-editor">
                    <div className={`shadow-1 h-full p-2 ${styles['div-editor-html']}`} dangerouslySetInnerHTML={{ __html: replaceText(content, data) }}></div>
                </div>
            </div>
        </section>
    );
}
