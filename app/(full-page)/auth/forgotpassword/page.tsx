'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '@customTypes/layout';
import { RecoverValidation } from '@validations/RecoverPasswordValidation';
import { ValidationFlow } from '@lib/ValidationFlow';
import { IZodError } from '@interfaces/IAuth';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Toast } from 'primereact/toast';
import { recoverPassword } from '@api/auth/recoverPassword';
import { showError, showSuccess } from '@lib/ToastMessages';
import { TokenBasicInformation } from '@lib/Token';
import { useSearchParams } from 'next/navigation';
import { IToken } from '@interfaces/ISession';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';
import { PasswordValidation } from '@validations/PasswordValidation';
import { updatePassword } from '@api/users';
import { HttpStatus } from '@enums/HttpStatusEnum';

const ForgotPassword: Page = () => {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState<string>('');
    const [token, setToken] = useState<IToken>();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isValidToken, setIsValidToken] = useState<boolean>(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        if (searchParams.get('recoverToken')) {
            const token = TokenBasicInformation(searchParams.get('recoverToken'));
            setToken(token);
            const d = new Date();

            if (token.exp < d.getTime()) {
                setIsValidToken(true);
            } else {
                showError(toast, '', 'El token de recuperación ya está vencido');
            }
        }
    }, [searchParams]);

    const handleRecover = async () => {
        //Validate data

        if (isValidToken) {
            showError(toast, '', 'El token de recuperación ya está vencido');
        }
        const validationFlow = ValidationFlow(
            RecoverValidation({
                email
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        // Call the API
        const res = await recoverPassword({
            email
        });

        if (res.code === 200 || res.code === 201) {
            showSuccess(toast, '', 'Correo enviado.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 1000);
        } else {
            showError(toast, '', res.message);
        }
    };

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

        const res = await updatePassword(token.sub, searchParams.get('recoverToken'), { password });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Contraseña actualizada');
            setTimeout(() => {
                router.push('/auth/login');
            }, 1000);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="flex h-screen">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-center">
                    <img src={`/layout/images/sodocu-transparent.svg`} className="h-4rem mt-4 mb-4" alt="logo-layout" />

                    {token ? (
                        <div className="flex flex-column align-items-center gap-4">
                            <div className="flex flex-column align-items-center gap-3">
                                <div className="mb-3 w-full">
                                    <Message
                                        className="w-full justify-content-center mb-3"
                                        text="Username is required"
                                        content={
                                            <div>
                                                <p className="mb-0">Al menos 8 caracteres de largo</p>
                                                <p className="mb-0">Use una mezcla de minúsculas y mayúsculas</p>
                                                <p className="mb-0">Incluya números y caracteres especiales</p>
                                            </div>
                                        }
                                    />
                                </div>

                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-lock z-2"></i>
                                    <Password
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        id="password"
                                        type="password"
                                        className={`w-full ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                                        inputClassName="w-full md:w-25rem"
                                        inputStyle={{ paddingLeft: '2.5rem' }}
                                        placeholder="Contraseña"
                                        toggleMask
                                    />
                                </span>

                                <span className="p-input-icon-left w-full">
                                    <i className="pi pi-lock z-2"></i>
                                    <Password
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        id="confirmPassword"
                                        type="password"
                                        className={`w-full ${VerifyErrorsInForms(validations, 'confirmPassword') ? 'p-invalid' : ''} `}
                                        inputClassName="w-full md:w-25rem"
                                        inputStyle={{ paddingLeft: '2.5rem' }}
                                        placeholder="Confirmar contraseña"
                                        feedback={false}
                                        toggleMask
                                    />
                                </span>
                                <div className="flex gap-3 w-full sm:w-25rem">
                                    <Button outlined className="p-ripple flex-auto" onClick={() => router.push('/auth/login')} label="Cancelar"></Button>
                                    <Button className="p-ripple flex-auto" onClick={() => handleSubmit()} label="Enviar"></Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-column align-items-center gap-4">
                            <div className="mb-3 w-full sm:w-25rem">
                                <h2>Recuperar contraseña</h2>
                                <p>Ingresa tu email, te enviaremos un enlace para restablecer tu contraseña.</p>
                            </div>

                            <span className="p-input-icon-left w-full sm:w-25rem">
                                <i className="pi pi-envelope"></i>
                                <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="text" className={`w-full md:w-25rem ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Correo" />
                            </span>

                            <div className="flex gap-3 w-full sm:w-25rem">
                                <Button outlined className="p-ripple flex-auto" onClick={() => router.push('/auth/login')} label="Cancelar"></Button>
                                <Button className="p-ripple flex-auto" onClick={() => handleRecover()} label="Enviar"></Button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat"
                    style={{
                        backgroundImage: "url('/layout/images/bg-login.webp')"
                    }}
                ></div>
            </div>
        </>
    );
};

export default ForgotPassword;
