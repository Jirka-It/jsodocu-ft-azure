import React, { useEffect, useRef, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Toast } from 'primereact/toast';
import { create, findByCode, update as updateDoc } from '@api/types';
import { IZodError } from '@interfaces/IAuth';
import { IModalCreate } from '@interfaces/IModal';
import { ValidationFlow } from '@lib/ValidationFlow';
import { showError, showSuccess, showWarn } from '@lib/ToastMessages';
import { states } from '@lib/data';
import { DocumentTypeValidation } from '@validations/DocumentTypeValidation';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { CleanText } from '@lib/CleanText';

export default function DocumentTypeModal({ state, setState, update, data }: IModalCreate) {
    const toast = useRef(null);
    const [timer, setTimer] = useState(null);
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [stateType, setStateType] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        if (data) {
            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            const state = states.filter((s) => s.code === data.state);
            setStateType(state[0]);
        } else {
            setCode('');
            setName('');
            setDescription('');
            setStateType('');
        }
    }, [data]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Tipo de documento</span>
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
            DocumentTypeValidation({
                code,
                name,
                description,
                state: stateType.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        var res;
        if (data) {
            res = await updateDoc(data._id, {
                code,
                name,
                description,
                state: stateType.code
            });
        } else {
            res = await create({
                code,
                name,
                description,
                state: stateType.code
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Tipo de documento creado');
            setTimeout(() => {
                update(!data ? 1 : null);
                handleClose();
            }, 1000);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setCode('');
        setName('');
        setDescription('');
        setStateType('');
        setValidations([]);
        update(null, false);
        setState(!state);
    };

    // Inputs events
    const handleChange = async (name: string) => {
        const newCode = CleanText(name);
        setCode(newCode);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await findByCode(newCode);
                if (!res) {
                    showWarn(toast, '', 'Ya existe un tipo con ese código');
                } else {
                    showWarn(toast, '', 'Código disponible');
                }
            } catch (error) {
                showError(toast, '', 'Contacte con soporte');
            }
        }, 1000);

        setTimer(newTimer);
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
                        Código <span className="text-red-500">*</span>
                    </label>

                    <InputText value={code} onChange={(e) => handleChange(e.target.value)} id="code" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'code') ? 'p-invalid' : ''} `} placeholder="Código" />
                </div>

                <div>
                    <label htmlFor="name">
                        Nombre <span className="text-red-500">*</span>
                    </label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                </div>

                <div className="w-full">
                    <label htmlFor="description">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'description') ? 'p-invalid' : ''} `}
                        placeholder="Descripción"
                        rows={5}
                        cols={30}
                    />
                </div>

                <div>
                    <label htmlFor="type">
                        Estado <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={stateType}
                        onChange={(e: any) => setStateType(e.value)}
                        options={states}
                        id="state"
                        optionLabel="name"
                        placeholder="Estado"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'state') ? 'p-invalid' : ''} `}
                    />{' '}
                </div>
            </div>
        </Dialog>
    );
}
function setTimer(newTimer: NodeJS.Timeout) {
    throw new Error('Function not implemented.');
}
