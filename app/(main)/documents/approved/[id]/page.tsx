'use client';

import React from 'react';

import styles from './DocumentEdit.module.css';
import Review from '@components/TabView/Review';

const Document = () => {
    return (
        <section className={styles['layout-tab-view']}>
            <Review />
        </section>
    );
};

export default Document;
