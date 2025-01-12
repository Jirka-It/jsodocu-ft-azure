import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalTemplate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Dropdown } from 'primereact/dropdown';
import { ValidationFlow } from '@lib/ValidationFlow';
import { DocumentValidation } from '@validations/DocumentValidation';
import { findAll } from '@api/types';
import { create, update as updateDoc } from '@api/documents';
import { IDocTypeResponse } from '@interfaces/IDocType';
import { State } from '@enums/StateEnum';
import { ISession } from '@interfaces/ISession';
import { showError, showSuccess } from '@lib/ToastMessages';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { TokenBasicInformation } from '@lib/Token';
import { State as StateDoc } from '@enums/DocumentEnum';

export default function TemplateModal({ state, setState, update, data, toast, scope }: IModalTemplate) {
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
            setType(data.type._id);
        } else {
            setName('');
            setType('');
        }
    }, [data]);

    const getTypes = async (page: number = 1, size: number = 100) => {
        const res = await findAll({ page, size });
        setTypes(res);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Template</span>
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
                type: type
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
                type: type
            });
        } else {
            res = await create({
                name,
                template: true,
                scope,
                type: type,
                step: StateDoc.EDITION,
                state: State.ACTIVE,
                creator: decoded.sub,
                version: 1
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', data ? 'Template editado' : 'Template creado');
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
            <div className="flex flex-column gap-4">
                <div>
                    <label htmlFor="name">
                        Nombre del template <span className="text-red-500">*</span>
                    </label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre del template" />
                </div>

                <div>
                    <label htmlFor="type">
                        Tipo de template <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={type}
                        onChange={(e) => setType(e.value)}
                        options={types?.data}
                        id="type"
                        optionLabel="name"
                        optionValue="_id"
                        placeholder="Tipo de template"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'type') ? 'p-invalid' : ''} `}
                    />{' '}
                </div>
            </div>
        </Dialog>
    );
}
