import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { PermissionValidation } from '@validations/PermissionValidation';
import { Configuration } from '@enums/PermissionEnum';
import { CleanText } from '@lib/CleanText';
import { showError, showInfo, showSuccess, showWarn } from '@lib/ToastMessages';
import { create, findByCode, update as updatePermission } from '@api/permissions';
import { useSession } from 'next-auth/react';
import { ISession } from '@interfaces/ISession';
import { HttpStatus } from '@enums/HttpStatusEnum';

const categories = [
    { name: 'Seguridad', code: Configuration.SECURITY },
    { name: 'Configuración', code: Configuration.CONFIGURATION },
    { name: 'Sistema', code: Configuration.SYSTEM }
];

export default function PermissionModal({ state, setState, update, data }: IModalCreate) {
    const toast = useRef(null);
    const [timer, setTimer] = useState(null);
    const { data: session } = useSession(); //data:session
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        if (data) {
            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            setCategory(categories.find((c) => c.code === data.category));
        } else {
            setCode('');
            setName('');
            setDescription('');
            setCategory('');
        }
    }, [data]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Permiso</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Guardar" onClick={() => handleSubmit()} />
        </div>
    );

    // Inputs events
    const handleChange = async (code: string) => {
        const newCode = CleanText(code);
        setCode(newCode);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await findByCode(newCode);
                if (!res) {
                    showWarn(toast, '', 'Ya existe un permiso con este código');
                } else {
                    showInfo(toast, '', 'Código disponible');
                }
            } catch (error) {
                showError(toast, '', 'Contacte con soporte');
            }
        }, 1000);

        setTimer(newTimer);
    };

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            PermissionValidation({
                code,
                name,
                description,
                category: category.code
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
            res = await updatePermission(data._id, {
                code,
                name,
                description,
                category: category.code
            });
        } else {
            res = await create({
                code,
                name,
                description,
                category: category.code,
                creator: v.user._id
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Permiso creado');
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
        setCategory('');
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
                    <label htmlFor="code">
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
                    <label htmlFor="category">
                        Categoría <span className="text-red-500">*</span>
                    </label>

                    <Dropdown
                        value={category}
                        onChange={(e) => setCategory(e.value)}
                        options={categories}
                        id="category"
                        optionLabel="name"
                        placeholder="Categoría"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'category') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
