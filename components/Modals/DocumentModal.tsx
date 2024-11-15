import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { DocumentValidation } from '@validations/DocumentValidation';
import { findAll } from '@api/types';
import { create, update as updateDoc } from '@api/documents';
import { IDocTypeResponse } from '@interfaces/IDocType';
import { State } from '@enums/ConfigurationEnum';
import { ISession } from '@interfaces/ISession';
import { showError, showSuccess } from '@lib/ToastMessages';
import { State as Step } from '@enums/DocumentEnum';

export default function DocumentModal({ state, setState, update, data }: IModalCreate) {
    const toast = useRef(null);
    const { data: session } = useSession(); //data:session
    const [name, setName] = useState<string>('');
    const [types, setTypes] = useState<IDocTypeResponse>();
    const [type, setType] = useState<any>('');
    //const [template, setTemplate] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        if (state) {
            getTypes();
        }
    }, [state]);

    useEffect(() => {
        if (data) {
            setName(data.name);
            setType(data.type);
        }
    }, [data]);

    const getTypes = async (page: number = 1, size: number = 100) => {
        const res = await findAll({ page, size });
        setTypes(res);
    };

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
                type: type.code
                //template: template.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const v: ISession = session as any;

        var res;
        if (data) {
            res = await updateDoc(data._id, {
                name,
                type: type._id
            });
        } else {
            res = await create({
                name,
                type: type._id,
                state: State.ACTIVE,
                creator: v.user._id,
                step: Step.EDITION,
                version: 1
            });
        }

        if (res.status === 200 || res.status === 201) {
            showSuccess(toast, '', 'Documento creado.');
            setTimeout(() => {
                update(!data ? 1 : null);
                handleClose();
            }, 1000);
        } else if (res.status === 400) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setName('');
        setType('');
        //setTemplate('');
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
                    <Dropdown
                        value={type}
                        onChange={(e) => setType(e.value)}
                        options={types?.data}
                        id="type"
                        optionLabel="name"
                        placeholder="Tipo de documento"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'type') ? 'p-invalid' : ''} `}
                    />{' '}
                </div>

                {/*
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
               */}
            </div>
        </Dialog>
    );
}
