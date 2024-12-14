import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { Password } from 'primereact/password';
import styles from './UserModal.module.css';

import { update as updateUser } from '@api/users';

import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showSuccess } from '@lib/ToastMessages';
import { PasswordValidation } from '@validations/PasswordValidation';

export default function UserPasswordModal({ state, setState, data }: IModalCreate) {
    const toast = useRef(null);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Clave</span>
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
        var validationFlow = null;

        validationFlow = ValidationFlow(
            PasswordValidation({
                password,
                confirmPassword
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const res = await updateUser(data._id, { password });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Contraseña actualizada');
            setTimeout(() => {
                handleClose();
            }, 1000);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setPassword('');
        setConfirmPassword('');
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
            style={{ width: '20rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />

            <div className="grid">
                <div className="col-12">
                    {' '}
                    <label htmlFor="email">
                        Contraseña <span className="text-red-500">*</span>
                    </label>
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

                <div className="col-12">
                    <label htmlFor="confirmPassword">
                        Confirmar contraseña <span className="text-red-500">*</span>
                    </label>

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
        </Dialog>
    );
}
