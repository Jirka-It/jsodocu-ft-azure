import { INodeGeneral } from '@interfaces/INode';
import { update, remove } from '@api/chapters';

export const addSection = (node: INodeGeneral, setNodes: Function) => {
    if (node.chapter) {
        //Endpoint to add article associated
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
        //Endpoint to add paragraph associated
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

export const handleChangeEvent = (node: INodeGeneral, content: string, setNodes: Function, timer: any, setTimer: any) => {
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

    clearTimeout(timer);
    const newTimer = setTimeout(async () => {
        /*
        try {
            const res = await findByName(newName);
            if (!res) {
                showWarn(toast, '', 'Ya existe un documento con este nombre');
            } else {
                showInfo(toast, '', 'Nombre disponible');
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
      */
        if (node.chapter) {
            update(node.key, { value: content });
        }
    }, 800);

    setTimer(newTimer);
};

export const deleteSection = async (node: INodeGeneral, setNodes: Function) => {
    if (node.chapter) {
        try {
            await remove(node.key);
            setNodes((prevArray) => {
                const modifiedNodes = prevArray.filter((c) => c.key !== node.key);
                return [...modifiedNodes];
            });
        } catch (error) {}
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
