import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface ITermsConditionsModal {
    state: boolean;
    setState: Function;
}

export default function TermsConditionsModal({ state, setState }: ITermsConditionsModal) {
    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <i className="pi pi-cog"></i>
            <span className="font-bold white-space-nowrap">Políticas de privacidad</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Ok" icon="pi pi-check" onClick={() => setState(!state)} autoFocus />
        </div>
    );

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '50rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <p className="m-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </Dialog>
    );
}
