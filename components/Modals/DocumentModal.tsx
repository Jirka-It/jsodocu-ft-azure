import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Dropdown } from 'primereact/dropdown';
import { ValidationFlow } from '@lib/ValidationFlow';
import { DocumentValidation } from '@validations/DocumentValidation';
import { findAll } from '@api/types';
import { findAll as findAllDoc, create, update as updateDoc } from '@api/documents';
import { IDocTypeResponse } from '@interfaces/IDocType';
import { State } from '@enums/StateEnum';
import { ISession } from '@interfaces/ISession';
import { showError, showSuccess } from '@lib/ToastMessages';
import { State as Step } from '@enums/DocumentEnum';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { TokenBasicInformation } from '@lib/Token';

export default function DocumentModal({ state, setState, update, data, toast }: IModalCreate) {
    const { data: session } = useSession(); //data:session
    const [name, setName] = useState<string>('');
    const [types, setTypes] = useState<IDocTypeResponse>();
    const [type, setType] = useState<any>('');
    const [templates, setTemplates] = useState<any>('');
    const [template, setTemplate] = useState<any>(null);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        if (state) {
            getTypes();
            getTemplates();
        }
    }, [state]);

    useEffect(() => {
        if (data) {
            setName(data.name);
            setType(data.type?._id);
        } else {
            setName('');
            setType('');
            //setTemplate('');
        }
    }, [data]);

    const getTypes = async (page: number = 1, size: number = 100) => {
        const res = await findAll({ page, size });
        setTypes(res);
    };

    const getTemplates = async (page: number = 1, size: number = 100) => {
        const params = { page, size, state: State.ACTIVE, template: true };
        const res = await findAllDoc(params);
        setTemplates(res.data);
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
                type
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
        const decoded = TokenBasicInformation(v.access_token);

        var res;
        if (data) {
            res = await updateDoc(data._id, {
                name,
                type
            });
        } else {
            let objToCreate = {
                name,
                type,
                state: State.ACTIVE,
                template: false,
                creator: decoded.sub,
                step: Step.EDITION,
                version: 1
            };

            if (template) {
                objToCreate['templateId'] = template;
            }

            res = await create(objToCreate);
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Documento creado');
            update(!data ? 1 : null);
            handleClose();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setName('');
        setType('');
        setTemplate(null);
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
                        optionValue="_id"
                        placeholder="Tipo de documento"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'type') ? 'p-invalid' : ''} `}
                    />{' '}
                </div>

                <div>
                    <label htmlFor="template">Plantilla</label>

                    <Dropdown
                        value={template}
                        onChange={(e) => setTemplate(e.value)}
                        options={templates}
                        id="template"
                        optionLabel="name"
                        optionValue="_id"
                        placeholder="Plantilla"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'template') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
