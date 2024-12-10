'use client';

import React from 'react';
import BasicInformationForm from '@components/Cards/BasicInformationCard';
import AccountSteps from '@components/Steps/AccountSteps';

const Account = () => {
    return (
        <div className="layout-permissions">
            <div className="grid">
                <div className="col-12 md:col-4">
                    <BasicInformationForm />
                </div>
                <div className="col-12 md:col-8">
                    <AccountSteps />
                </div>
            </div>
        </div>
    );
};

export default Account;
