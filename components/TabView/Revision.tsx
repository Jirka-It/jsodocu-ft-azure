import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Toast } from 'primereact/toast';

import stylesRevision from './Revision.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import InfiniteScroll from 'react-infinite-scroll-component';
import { findByIdLight as findDocument } from '@api/documents';
import { showError, showInfo, showWarn } from '@lib/ToastMessages';
import { findAllPreview } from '@api/chapters';
import { findAllByAccount } from '@api/users';
import { update } from '@api/documents';

import { IUser } from '@interfaces/IUser';
import { State } from '@enums/DocumentEnum';

export default function Revision() {
    const params = useParams();
    const toast = useRef(null);
    const [user, setUser] = useState<any>('');
    const [length, setLength] = useState(1);
    const [content, setContent] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<Array<IUser>>([]);

    useEffect(() => {
        getInitialContent();
        getUsers();
    }, []);

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

    const getInitialContent = async () => {
        try {
            const res = await findDocument(params.id);
            const resChapter = await findAllPreview({ page: 1, size: 1 });

            setContent(content + res.title + resChapter);
        } catch (error) {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const getChapters = async (page: number = 1, size: number = 1) => {
        const params = { page, size };
        const res = await findAllPreview(params);
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
            const res = await update(params.id, {
                reviewer: user,
                step: State.REVIEW
            });
            if (!res) {
                showWarn(toast, '', 'YContacte con soporte');
            } else {
                showInfo(toast, '', 'Documento asignado');
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

                <div>
                    <label htmlFor="name">Usuario asignado</label>
                    <Dropdown value={user} onChange={(e) => setUser(e.value)} options={users} id="user" optionLabel="fullName" optionValue="_id" placeholder="Usuario responsable" className="w-full mt-2" />
                </div>

                <div className="flex justify-content-center mt-5">
                    <Button label="Asignar" onClick={() => handleSubmit()} />
                </div>
            </div>
            <div className="col-12 md:col-8">
                <div className={`${stylesRevision['header-editor']}`}>
                    <div className="header-editor__description">
                        <h4 className="m-0">Conjunto Amatista</h4>
                        <h6 className="m-0 text-gray-500">Reglamento PH</h6>
                    </div>
                </div>

                <InfiniteScroll dataLength={length} next={fetchMoreData} hasMore={true} loader="" height={700} className="ql-editor">
                    <div className={`shadow-1 p-2 ${stylesRevision['editor']}`} dangerouslySetInnerHTML={{ __html: content }}></div>
                </InfiniteScroll>
            </div>
        </section>
    );
}
