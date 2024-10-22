import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModal } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { UserValidation } from '@validations/UserValidation';
import { MultiSelect } from 'primereact/multiselect';
import { Password } from 'primereact/password';

import styles from './UserModal.module.css';

const categories = [
    { name: 'Verificación de documentos', code: 'DOC-000' },
    { name: 'Verificación de cuentas', code: 'ACC-000' },
    { name: 'Verificación de usuarios', code: 'USER-000' }
];

export default function UserModal({ state, setState }: IModal) {
    const toast = useRef(null);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [roles, setRoles] = useState<Array<any>>([]);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Usuario</span>
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
            UserValidation({
                name,
                email,
                password,
                confirmPassword,
                roles: roles
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
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRoles([]);
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
                    <label htmlFor="name">Nombre</label>

                    <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                </div>

                <div>
                    <label htmlFor="email">Correo</label>

                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Correo" />
                </div>

                <div className="w-full">
                    <label htmlFor="email">Contraseña</label>

                    <Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        type="password"
                        className={`${styles['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                        placeholder="Contraseña"
                        toggleMask
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="email">Confirmar contraseña</label>

                    <Password
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        id="confirmPassword"
                        type="password"
                        className={`${styles['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'confirmPassword') ? 'p-invalid' : ''} `}
                        placeholder="Contraseña"
                        feedback={false}
                        toggleMask
                    />
                </div>

                <div>
                    <label htmlFor="category">Roles</label>

                    <MultiSelect value={roles} onChange={(e) => setRoles(e.value)} options={categories} optionLabel="name" id="rol" placeholder="Roles" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'roles') ? 'p-invalid' : ''} `} />
                </div>
            </div>
        </Dialog>
    );
}
