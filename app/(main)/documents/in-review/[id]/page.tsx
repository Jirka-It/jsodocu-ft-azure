'use client';
import { useSearchParams } from 'next/navigation';

import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import styles from './DocumentEdit.module.css';
import Editor from '@components/TabView/Editor';
import Revision from '@components/TabView/Revision';

const Document = () => {
    const searchParams = useSearchParams();
    const [readOnly, setReadOnly] = useState(null);

    useEffect(() => {
        setReadOnly(searchParams.get('read-only'));
    }, []);

    return (
        <section className={styles['layout-tab-view']}>
            <TabView>
                <TabPanel header="Editor" leftIcon="pi pi-file-edit mr-2">
                    <Editor inReview={true} readOnly={readOnly} />
                </TabPanel>

                {!readOnly ? (
                    <TabPanel header="Revisión" leftIcon="pi pi-search mr-2">
                        <Revision inReview={true} />
                    </TabPanel>
                ) : (
                    ''
                )}
            </TabView>
        </section>
    );
};

export default Document;
