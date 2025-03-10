import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toast } from 'primereact/toast';
import { useDispatch } from 'react-redux';

import stylesRevision from './Revision.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import InfiniteScroll from 'react-infinite-scroll-component';
import { findByIdLight as findDocument, updateWithState } from '@api/documents';
import { showError, showInfo, showWarn } from '@lib/ToastMessages';
import { findAllPreview, findAllComments } from '@api/documents';
import { findAllWithOutPagination } from '@api/variables';

import { findAllByAccount } from '@api/users';

import { IUser } from '@interfaces/IUser';
import { State } from '@enums/DocumentEnum';
import { IDocument } from '@interfaces/IDocument';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { addInReview, subInReview, addInEdition, subInEdition } from '@store/slices/menuSlices';
import { format } from 'date-fns';
import { IVariableLight } from '@interfaces/IVariable';
import { replaceText } from '@lib/ReplaceText';

export default function Revision({ inReview }) {
    const dispatch = useDispatch();
    const paramsUrl = useParams();
    const toast = useRef(null);
    const [user, setUser] = useState<any>('');
    const [doc, setDoc] = useState<IDocument>(null);
    const [variables, setVariables] = useState<Array<IVariableLight>>([]);

    const [comments, setComments] = useState<number>(0);
    const [length, setLength] = useState(1);
    const [content, setContent] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<Array<IUser>>([]);
    const router = useRouter();

    useEffect(() => {
        getInitialContent();
        getUsers();
        getComments();
        getVariables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getVariables = async () => {
        const res = await findAllWithOutPagination({ documentId: paramsUrl.id });
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

    // Users, title and chapters

    const getUsers = async () => {
        try {
            const res = await findAllByAccount({ page: 1, size: 100 });

            const newUsers = res.map((u) => {
                return { ...u, fullName: `${u.name} ${u.lastName}` };
            });

            setUsers(newUsers);
        } catch (error) {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const getComments = async () => {
        const res = await findAllComments(paramsUrl.id);
        setComments(res);
    };

    const getInitialContent = async () => {
        try {
            const res = await findDocument(paramsUrl.id);
            setDoc(res);

            if (res) {
                setUser(res.creator);
            }

            const resChapter = await findAllPreview(paramsUrl.id, { page: 1, size: 5 });

            setContent(content + (res.title ?? '') + '\n' + resChapter);
        } catch (error) {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const getChapters = async (page: number = 1, size: number = 5) => {
        const params = { page, size };
        const res = await findAllPreview(paramsUrl.id, params);
        if (res) {
            setLength(length + 1);
            setContent(content + res);
        }
    };

    //Get more data

    const fetchMoreData = () => {
        const newPage = page + 1;
        getChapters(newPage);
        setPage(newPage);
    };

    const handleSubmit = async () => {
        if (!user) {
            showError(toast, '', 'Debe asignar un usuario');
            return;
        }

        try {
            const res = await updateWithState(paramsUrl.id, {
                reviewer: user,
                step: State.REVIEW,
                dateOfUpdate: format(new Date(), 'yyyy-MM-dd')
            });

            dispatch(addInReview());
            dispatch(subInEdition());

            if (res.status === HttpStatus.FORBIDDEN) {
                showError(toast, '', 'El documento ya fué enviado a revisar');
                return;
            }

            if (!res) {
                showWarn(toast, '', 'Contacte con soporte');
            } else {
                showInfo(toast, '', 'Documento asignado');
                setTimeout(() => {
                    router.push('/documents/in-edition');
                }, 1000);
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    const handleBack = async () => {
        try {
            const res = await updateWithState(paramsUrl.id, {
                reviewer: user,
                step: State.EDITION,
                dateOfUpdate: format(new Date(), 'yyyy-MM-dd')
            });

            dispatch(addInEdition());
            dispatch(subInReview());

            if (res.status === HttpStatus.FORBIDDEN) {
                showError(toast, '', 'El documento ya fué enviado a edición');
                return;
            }

            if (!res) {
                showWarn(toast, '', 'Contacte con soporte');
            } else {
                showInfo(toast, '', 'Documento devuelto');
                setTimeout(() => {
                    router.push('/documents/in-review');
                }, 1000);
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    const handleApprove = async () => {
        try {
            const res = await updateWithState(paramsUrl.id, {
                reviewer: user,
                step: State.APPROVED,
                version: doc.version + 1,
                dateOfUpdate: format(new Date(), 'yyyy-MM-dd')
            });

            dispatch(subInReview());

            if (res.status === HttpStatus.FORBIDDEN) {
                showError(toast, '', 'El documento ya fué aprobado');
                return;
            }
            if (!res) {
                showWarn(toast, '', 'Contacte con soporte');
            } else {
                showInfo(toast, '', 'Documento aprobado');
                setTimeout(() => {
                    router.push('/documents/in-review');
                }, 1000);
            }
        } catch (error) {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    return (
        <section className="grid">
            <Toast ref={toast} />
            <div className="col-12 md:col-4">
                <h3 className="m-0 mb-1 text-blue-500 font-bold cursor-pointer">Revisión</h3>

                {inReview ? (
                    <>
                        <label htmlFor="name">Usuario asignado</label>
                        <Dropdown disabled={true} value={user} onChange={(e) => setUser(e.value)} options={users} id="user" optionLabel="fullName" optionValue="_id" placeholder="Usuario responsable" className="w-full mt-2" />

                        <div className="flex justify-content-center mt-5">
                            {comments ? <Button className="text-white" label="Enviar a corrección" severity="warning" onClick={() => handleBack()} /> : <Button label="Aprobar documento" onClick={() => handleApprove()} />}
                        </div>
                    </>
                ) : (
                    <>
                        <label htmlFor="name">Usuario asignado</label>
                        <Dropdown value={user} onChange={(e) => setUser(e.value)} options={users} id="user" optionLabel="fullName" optionValue="_id" placeholder="Usuario responsable" className="w-full mt-2" />

                        <div className="flex justify-content-center mt-5">{comments && comments > 0 ? <Button label={`Tienes ${comments} comentarios`} severity="danger" /> : <Button label="Asignar documento" onClick={() => handleSubmit()} />}</div>
                    </>
                )}
            </div>
            <div className="col-12 md:col-8">
                <div className={`${stylesRevision['header-editor']}`}>
                    <div className="header-editor__description">
                        <h5 className="m-0 ml-3">{doc?.name}</h5>
                    </div>
                </div>

                <InfiniteScroll dataLength={length} next={fetchMoreData} hasMore={true} loader="" height={700} className="ql-editor">
                    <div className={`shadow-1 p-2 ${stylesRevision['editor']}`} dangerouslySetInnerHTML={{ __html: replaceText(content, variables) }}></div>
                </InfiniteScroll>
            </div>
        </section>
    );
}
