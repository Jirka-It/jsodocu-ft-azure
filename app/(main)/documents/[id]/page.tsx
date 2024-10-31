'use client';

import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import styles from './DocumentEdit.module.css';
import Variables from '@components/TabView/Variables';
import Editor from '@components/TabView/Editor';

const Document = () => {
    return (
        <section className={styles['layout-tab-view']}>
            <TabView>
                <TabPanel header="Variables" leftIcon="pi pi-times mr-2">
                    <Variables />
                </TabPanel>
                <TabPanel header="Editor" leftIcon="pi pi-file-edit mr-2">
                    <Editor />
                </TabPanel>
                <TabPanel header="Revisión" leftIcon="pi pi-search mr-2">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>

                <TabPanel header="Exportar" leftIcon="pi pi-file-export mr-2">
                    <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                        qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                    </p>
                </TabPanel>
            </TabView>
        </section>
    );
};

export default Document;
