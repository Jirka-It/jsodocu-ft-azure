'use client';

import React, { useRef, useState } from 'react';
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

const ForgotPassword: Page = () => {
    const [email, setEmail] = useState<string>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const router = useRouter();
    const toast = useRef(null);

    const handleRecover = async () => {
        //Validate data

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
            showSuccess(toast, '', 'Correo envíado.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 1500);
        } else {
            showError(toast, '', res.message);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="flex h-screen">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-center">
                    <img src={`/layout/images/logo-dark.svg`} className="h-4rem mt-4 mb-4" alt="diamond-layout" />
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
                </div>
                <div
                    className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat"
                    style={{
                        backgroundImage: "url('/demo/images/auth/bg-login.jpg')"
                    }}
                >
                    <div className="mt-auto mb-auto">
                        {/**
                          <span className="block text-white text-7xl font-semibold">
                            Reset your
                            <br />
                            Password
                        </span>
                      <span className="block text-white text-3xl mt-4">
                            Lorem ipsum dolor sit amet, consectetur
                            <br /> adipiscing elit. Donec posuere velit nec enim
                            <br /> sodales, nec placerat erat tincidunt.{' '}
                        </span>

                     */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
