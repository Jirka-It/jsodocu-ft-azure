'use client';

import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';

import VariableList from '@components/TabView/VariableList';
import Editor from '@components/TabView/Editor';
import Revision from '@components/TabView/Revision';

const Document = () => {
    return (
        <section className="layout-tab-view">
            <TabView>
                <TabPanel header="Variables" leftIcon="pi pi-times mr-2">
                    <VariableList />
                </TabPanel>
                <TabPanel header="Editor" leftIcon="pi pi-file-edit mr-2">
                    <Editor inReview={false} />
                </TabPanel>
                <TabPanel header="Revisión" leftIcon="pi pi-search mr-2">
                    <Revision inReview={false} />
                </TabPanel>
            </TabView>
        </section>
    );
};

export default Document;
