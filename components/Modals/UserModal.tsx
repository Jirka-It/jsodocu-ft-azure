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
import { Password } from 'primereact/password';

import styles from './UserModal.module.css';
import { PickList } from 'primereact/picklist';

const rolesArray = [
    { name: 'Abogado', code: 'DOC-000' },
    { name: 'Comercial', code: 'ACC-000' },
    { name: 'Operativo', code: 'USER-000' }
];

export default function UserModal({ state, setState }: IModal) {
    const toast = useRef(null);
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [source, setSource] = useState(rolesArray);
    const [target, setTarget] = useState([]);

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

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            UserValidation({
                name,
                lastName,
                username: email,
                password,
                state: 'ACTIVE',
                confirmPassword,
                roles: target
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
        setSource([]);
        setTarget([]);
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
            style={{ width: '90rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />

            <div className="flex flex-column gap-4">
                <div className="grid">
                    <div className="col-12 sm:col-6">
                        <label htmlFor="name">Nombre</label>
                        <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                    </div>
                    <div className="col-12 sm:col-6">
                        <label htmlFor="email">Correo</label>

                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Correo" />
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 sm:col-6">
                        {' '}
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

                    <div className="col-12 sm:col-6">
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
                </div>

                <div>
                    <label htmlFor="category">Roles</label>
                    <PickList
                        className="mt-2"
                        itemTemplate={(item) => <p>{item.name}</p>}
                        showSourceControls={false}
                        showTargetControls={false}
                        showSourceFilter={false}
                        showTargetFilter={false}
                        dataKey="code"
                        source={source}
                        target={target}
                        onChange={onChange}
                        filter
                        filterBy="name"
                        breakpoint="960px"
                        sourceHeader="Disponibles"
                        targetHeader="Seleccionados"
                        sourceStyle={{ height: '24rem' }}
                        targetStyle={{ height: '24rem' }}
                    />
                    {/*                     <MultiSelect value={roles} onChange={(e) => setRoles(e.value)} options={categories} optionLabel="name" id="rol" placeholder="Roles" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'roles') ? 'p-invalid' : ''} `} />
                     */}
                </div>
            </div>
        </Dialog>
    );
}
