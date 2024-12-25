import { INodeGeneral } from '@interfaces/INode';
import { update, remove } from '@api/chapters';
import { create, update as updateArticle, remove as removeArticle } from '@api/articles';
import { create as createParagraph, remove as removeParagraph } from '@api/paragraphs';

export const addSection = async (node: INodeGeneral, setNodes: Function, setExpandedKeys: Function) => {
    if (node.chapter) {
        const nodeToOpen = node.key;

        setExpandedKeys((prevValue) => {
            let object = prevValue;
            object[nodeToOpen] = true;
            return object;
        });

        //setExpandedKeys(object);
    }

    if (node.article) {
        const nodeToOpen = node.key;

        setExpandedKeys((prevValue) => {
            let object = prevValue;
            object[nodeToOpen] = true;
            return object;
        });
    }

    if (node.chapter) {
        const res = await create({
            label: `Artículo`,
            value: '',
            article: true,
            content: '',
            children: [],
            ownChapter: node.key
        });
        //Endpoint to add article associated

        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.key) {
                    c.children.push({ ...res.data, key: res.data._id });
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }

    if (node.article) {
        //Endpoint to add paragraph associated
        const res = await createParagraph({
            label: `Paragrafo`,
            paragraph: true,
            content: '',
            ownChapter: node.ownChapter,
            ownArticle: node.key
        });

        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        if (a.key === node.key) {
                            a.children.push({ ...res.data, key: res.data._id });
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
                if (c.key === node.ownChapter) {
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
        if (node.article) {
            updateArticle(node.key, { value: content });
        }

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
        await removeArticle(node.key);
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    const newArticles = c.children.filter((a) => a.key !== node.key);
                    c.children = newArticles;
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }

    if (node.paragraph) {
        await removeParagraph(node.key);
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        if (a.key === node.ownArticle) {
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

export const updateComments = async (node: INodeGeneral, count, setNodes: Function) => {
    if (node.article) {
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        if (a.key == node.key) {
                            a['count'] = count;
                        }
                    });
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }

    if (node.paragraph) {
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        a.children.map((p) => {
                            if (p.key == node.key) {
                                p['count'] = count;
                            }
                        });
                    });
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }
};

export const updateApprove = async (node: INodeGeneral, setNodes: Function) => {
    if (node.article) {
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        if (a.key == node.key) {
                            a['approved'] = true;
                        }
                    });
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }

    if (node.paragraph) {
        setNodes((prevArray) => {
            const modifiedNodes = prevArray.map((c) => {
                if (c.key === node.ownChapter) {
                    c.children.map((a) => {
                        a.children.map((p) => {
                            if (p.key == node.key) {
                                p['approved'] = true;
                            }
                        });
                    });
                }

                return c;
            });
            return [...modifiedNodes];
        });
    }
};
