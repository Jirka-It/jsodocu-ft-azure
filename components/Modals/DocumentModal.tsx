import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModal } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { DocumentValidation } from '@validations/DocumentValidation';

import { findAll } from '@api/documents';

const types = [
    { name: 'Reglamento PH', code: 'CUSTOMER_ADMIN' },
    { name: 'Reglamento PH (Adic)', code: 'CUSTOMER' },
    { name: 'Contrato', code: 'CUSTOMER' },
    { name: 'Poder', code: 'CUSTOMER' }
];

const templates = [{ name: 'En blanco (Nuevo)', code: 'CUSTOMER_ADMIN' }];

export default function DocumentModal({ state, setState }: IModal) {
    const toast = useRef(null);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<any>('');
    const [template, setTemplate] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Documento</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Guardar" onClick={() => handleSubmit()} />
        </div>
    );

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            DocumentValidation({
                name,
                type: type.code,
                template: template.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const res = await findAll();
    };

    const handleClose = async () => {
        setName('');
        setType('');
        setTemplate('');
        setValidations([]);
        setState(!state);
    };

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />

            <div className="flex flex-column gap-4">
                <div>
                    <label htmlFor="name">
                        Nombre del documento <span className="text-red-500">*</span>
                    </label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre del documento" />
                </div>

                <div>
                    <label htmlFor="type">
                        Tipo de documento <span className="text-red-500">*</span>
                    </label>

                    <Dropdown value={type} onChange={(e) => setType(e.value)} options={types} id="type" optionLabel="name" placeholder="Tipo de documento" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'type') ? 'p-invalid' : ''} `} />
                </div>

                <div>
                    <label htmlFor="template">
                        Plantilla <span className="text-red-500">*</span>
                    </label>

                    <Dropdown
                        value={template}
                        onChange={(e) => setTemplate(e.value)}
                        options={templates}
                        id="template"
                        optionLabel="name"
                        placeholder="Plantilla"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'template') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
