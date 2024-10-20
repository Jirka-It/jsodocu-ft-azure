'use client';

import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Page } from '@/types/layout';
import Link from 'next/link';
import TermsConditionsModal from '@/components/Modals/TermsConditionsModal';

const RegisterPage: Page = () => {
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [openTermsConditionsModal, setOpenTermsConditionsModal] = useState<boolean>(false);
    const router = useRouter();

    return (
        <>
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
                                <InputText id="username" type="text" className="w-full md:w-25rem" placeholder="Nombre de usuario" />
                            </span>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-envelope"></i>
                                <InputText id="email" type="text" className="w-full md:w-25rem" placeholder="Correo" />
                            </span>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-lock z-2"></i>
                                <Password id="password" type="password" className="w-full" inputClassName="w-full md:w-25rem" inputStyle={{ paddingLeft: '2.5rem' }} placeholder="Contraseña" toggleMask />
                            </span>

                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-lock z-2"></i>
                                <Password id="password" type="password" className="w-full" inputClassName="w-full md:w-25rem" inputStyle={{ paddingLeft: '2.5rem' }} placeholder="Confirmar contraseña" toggleMask feedback={false} />
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
                            <Button label="Regístrate" className="w-full" onClick={() => router.push('/auth/login')}></Button>
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
