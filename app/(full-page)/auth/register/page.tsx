'use client';

import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Page } from '@customTypes/layout';
import Link from 'next/link';
import TermsConditionsModal from '@components/Modals/TermsConditionsModal';
import { RegisterValidation } from '@validations/RegisterValidation';
import { showError, showSuccess } from '@lib/ToastMessages';
import { IZodError } from '@interfaces/IAuth';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { registerUser } from '@api/auth/register';
import { State } from '@enums/StateEnum';

const RegisterPage: Page = () => {
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [openTermsConditionsModal, setOpenTermsConditionsModal] = useState<boolean>(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const router = useRouter();
    const toast = useRef(null);

    const handleRegister = async () => {
        if (!confirmed) {
            showError(toast, '', 'Debe aceptar la Política de Tratamiento de Datos.');
            return;
        }
        //Validate data

        const validationFlow = ValidationFlow(
            RegisterValidation({
                name,
                username,
                password,
                confirmPassword,
                state: State.ACTIVE
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        // Call the API
        const res = await registerUser({
            name,
            username,
            password,
            state: State.ACTIVE
        });

        if (res.code === 200 || res.code === 201) {
            showSuccess(toast, '', 'Usuario creado.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 1000);
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
                        <div className="mb-3">
                            <h2>Registro</h2>
                        </div>

                        <div className="flex flex-column gap-4">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-user"></i>
                                <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} type="text" className={`w-full md:w-25rem ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                            </span>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-envelope"></i>
                                <InputText id="email" value={username} onChange={(e) => setUsername(e.target.value)} type="text" className={`w-full md:w-25rem ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Correo" />
                            </span>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-lock z-2"></i>
                                <Password
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    className={`w-full ${VerifyErrorsInForms(validations, 'confirmPassword') ? 'p-invalid' : ''} `}
                                    inputClassName="w-full md:w-25rem"
                                    inputStyle={{ paddingLeft: '2.5rem' }}
                                    placeholder="Confirmar contraseña"
                                    toggleMask
                                    feedback={false}
                                />
                            </span>
                            <div className="flex flex-wrap justify-content-center">
                                <Checkbox name="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.checked)} className="mr-2"></Checkbox>

                                <label htmlFor="checkbox" className="text-900 font-medium mr-2">
                                    Acepto la
                                </label>
                                <a onClick={() => setOpenTermsConditionsModal(true)} className="text-color-secondary font-semibold cursor-pointerhover:text-primary cursor-pointer">
                                    Política de Tratamiento de Datos.
                                </a>

                                <TermsConditionsModal state={openTermsConditionsModal} setState={(e) => setOpenTermsConditionsModal(e)} />
                            </div>
                            <Button label="Regístrate" className="w-full" onClick={handleRegister}></Button>
                            <span className="font-semibold text-color-secondary">
                                ¿Ya tienes una cuenta?
                                <Link href="/auth/login" className="ml-2 font-semibold cursor-pointer primary-color">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat" style={{ backgroundImage: "url('/demo/images/auth/bg-login.jpg')" }}>
                    {/*
                    <div className="mt-auto mb-auto">
                        <span className="block text-white text-7xl font-semibold">
                            Create a<br />
                            Diamond
                            <br />
                            Account
                        </span>
                        <span className="block text-white text-3xl mt-4">
                            Lorem ipsum dolor sit amet, consectetur
                            <br /> adipiscing elit. Donec posuere velit nec enim
                            <br /> sodales, nec placerat erat tincidunt.{' '}
                        </span>
                    </div>

                    */}
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
