'use client';

import React, { useState } from 'react';
import BasicInformationForm from '@components/Forms/BasicInformationForm';

const Account = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);

    return (
        <div className="layout-permissions">
            <div className="grid">
                <div className="col-12 sm:col-6">
                    <BasicInformationForm />
                </div>
                <div className="col-12 sm:col-6"></div>
            </div>
        </div>
    );
};

export default Account;
