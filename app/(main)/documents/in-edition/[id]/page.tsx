'use client';
import { useParams } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import styles from './DocumentEdit.module.css';
import VariableList from '@components/TabView/VariableList';
import Editor from '@components/TabView/Editor';
import Revision from '@components/TabView/Revision';
import { findByIdLight } from '@api/documents';
import { IDocument } from '@interfaces/IDocument';

const Document = () => {
    const params = useParams();
    const [document, setDocument] = useState<IDocument>();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await findByIdLight(params.id);
        setDocument(res);
    };

    return (
        <section className={styles['layout-tab-view']}>
            <TabView>
                <TabPanel header="Variables" leftIcon="pi pi-times mr-2">
                    <VariableList />
                </TabPanel>
                <TabPanel header="Editor" leftIcon="pi pi-file-edit mr-2">
                    <Editor doc={document} inReview={false} />
                </TabPanel>
                <TabPanel header="Revisión" leftIcon="pi pi-search mr-2">
                    <Revision doc={document} inReview={false} />
                </TabPanel>
            </TabView>
        </section>
    );
};

export default Document;
