'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Page } from '@customTypes/layout';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';
import { LoginValidation } from '@validations/LoginValidation';
import { Toast } from 'primereact/toast';
import { showError } from '@lib/ToastMessages';
import { IZodError } from '@interfaces/IAuth';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { ValidationFlow } from '@lib/ValidationFlow';
import { HttpStatus } from '@enums/HttpStatusEnum';

const LoginPage: Page = () => {
    const router = useRouter();
    const toast = useRef(null);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [saveMe, setSaveMe] = useState<boolean>(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        setEmail(localStorage.getItem('email') ? localStorage.getItem('email') : '');
        setSaveMe(localStorage.getItem('saveMe') ? true : false);
    }, []);

    const handleLocalStorage = () => {
        if (saveMe) {
            localStorage.setItem('email', email);
            localStorage.setItem('saveMe', 'true');
        } else {
            localStorage.removeItem('email');
            localStorage.removeItem('saveMe');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        //Validate data
        const validationFlow = ValidationFlow(
            LoginValidation({
                email,
                password
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        // Call the API
        const res = await signIn('credentials', {
            email,
            password,
            redirect: false
        });

        if (res.status === HttpStatus.OK) {
            router.push('/');
        } else if (parseInt(res.error) === HttpStatus.UNAUTHORIZED) {
            showError(toast, '', 'Credenciales incorrectas.');
        } else if (parseInt(res.error) === HttpStatus.FORBIDDEN) {
            showError(toast, '', 'Su cuenta ha sido inactivada y debe contactar al administrador.');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="flex h-screen">
                <form className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-between" onSubmit={handleLogin}>
                    <img src={`/layout/images/logo-dark.svg`} className="h-4rem mt-4 mb-4" alt="diamond-layout" />

                    <div className="flex flex-column align-items-center gap-4">
                        <div>
                            <h2>¡Bienvenido!</h2>
                        </div>

                        <div className="flex flex-column gap-4">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-envelope"></i>
                                <InputText
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        handleLocalStorage();
                                    }}
                                    id="email"
                                    type="text"
                                    className={`w-full md:w-25rem ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `}
                                    placeholder="Correo"
                                />
                            </span>

                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-lock z-2"></i>
                                <Password
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        handleLocalStorage();
                                    }}
                                    value={password}
                                    id="password"
                                    type="password"
                                    className={`w-25rem ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                                    inputClassName="w-full md:w-30rem"
                                    inputStyle={{ paddingLeft: '2.5rem' }}
                                    placeholder="Contraseña"
                                    feedback={false}
                                    toggleMask
                                />
                            </span>
                        </div>
                        <div className="flex align-items-center justify-content-between w-25rem">
                            <div>
                                <Checkbox inputId="rememberMe" onChange={() => setSaveMe(!saveMe)} name="rememberMe" value="true" checked={saveMe} />
                                <label htmlFor="rememberMe" className="ml-2">
                                    Recuerdame
                                </label>
                            </div>
                            <p>
                                <Link href="/auth/forgotpassword" className="text-primary hover:underline cursor-pointer font-medium">
                                    ¿Olvidó su contraseña?
                                </Link>{' '}
                            </p>
                        </div>

                        <Button onClick={handleLogin} label="Ingresar" className="w-25rem"></Button>

                        <div className="flex align-items-center justify-content-center w-20rem">
                            <p className="mb-0">¿Aún no tienes cuenta?</p>
                            <Link href="/auth/register" className="ml-2 text-primary hover:underline cursor-pointer font-medium">
                                Regístrate
                            </Link>{' '}
                        </div>
                    </div>

                    <p>
                        2024 - Desarrollado por{' '}
                        <Link href="https://www.jirka.co/" target="_blank" className="text-primary hover:underline cursor-pointer font-medium">
                            Jirka
                        </Link>
                    </p>
                </form>
                <div className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat" style={{ backgroundImage: "url('/demo/images/auth/bg-login.jpg')" }}>
                    {/*
                    <div className="mt-auto mb-auto">
                        <span className="block text-white text-7xl font-semibold">
                            Access to your <br />
                            Diamond <br />
                            Account
                        </span>
                        <span className="block text-white text-3xl mt-4">
                            Lorem ipsum dolor sit amet, consectetur
                            <br /> adipiscing elit. Donec posuere velit nec enim
                            <br /> sodales, nec placerat erat tincidunt.{' '}
                        </span>
                    </div>
                    <div className="flex align-items-center gap-5">
                        <span className="text-white font-semibold">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                        <i className="pi pi-github text-3xl p-1 surface-overlay border-circle cursor-pointer"></i>
                        <i className="pi pi-twitter text-3xl p-1 surface-overlay border-circle cursor-pointer"></i>
                    </div>
                   */}
                </div>
            </div>
        </>
    );
};

export default LoginPage;
