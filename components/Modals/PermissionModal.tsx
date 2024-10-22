import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModal } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { PermissionValidation } from '@validations/PermissionValidation';

const categories = [
    { name: 'Administración', code: 'CUSTOMER_ADMIN' },
    { name: 'Operativo', code: 'CUSTOMER' }
];

export default function PermissionModal({ state, setState }: IModal) {
    const toast = useRef(null);
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [category, setCategory] = useState<any>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

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
                    <label htmlFor="code">Código</label>
                    <InputText value={code} onChange={(e) => setCode(e.target.value)} id="code" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'code') ? 'p-invalid' : ''} `} placeholder="Código" />
                </div>

                <div>
                    <label htmlFor="code">Nombre</label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                </div>

                <div className="w-full">
                    <label htmlFor="description">Descripción</label>
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
                    <label htmlFor="category">Categoría</label>

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
