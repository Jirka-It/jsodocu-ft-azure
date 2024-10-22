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
import { RolValidation } from '@validations/RolValidation';
import { MultiSelect } from 'primereact/multiselect';

const permissionsArray = [
    { name: 'Verificación de documentos', code: 'DOC-000' },
    { name: 'Verificación de cuentas', code: 'ACC-000' },
    { name: 'Verificación de usuarios', code: 'USER-000' }
];

export default function RolModal({ state, setState }: IModal) {
    const toast = useRef(null);
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [permissions, setPermissions] = useState<Array<any>>([]);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Rol</span>
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
            RolValidation({
                code,
                name,
                description,
                permissions
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
        setPermissions([]);
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
                    <label htmlFor="name">Nombre</label>

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
                    <label htmlFor="category">Permisos</label>

                    <MultiSelect
                        value={permissions}
                        onChange={(e) => setPermissions(e.value)}
                        options={permissionsArray}
                        optionLabel="name"
                        id="permission"
                        placeholder="Permisos"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'permissions') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
