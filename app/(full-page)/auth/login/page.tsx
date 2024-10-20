'use client';

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Page } from '@/types/layout';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Password } from 'primereact/password';

const LoginPage: Page = () => {
    const router = useRouter();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [saveMe, setSaveMe] = useState<boolean>(false);

    const handleLogin = async () => {
        const res = await signIn('credentials', {
            username: name,
            password: email,
            redirect: false
        });

        if (res.status === 200) {
            router.push('/');
        } else {
            router.push('/auth/login');
        }
    };

    return (
        <>
            <div className="flex h-screen">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-center">
                    <img src={`/layout/images/logo-dark.svg`} className="h-4rem mt-4 mb-4" alt="diamond-layout" />

                    <div className="flex flex-column align-items-center gap-4">
                        <div>
                            <h2>¡Bienvenido!</h2>
                        </div>

                        <div className="flex flex-column gap-4">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-envelope"></i>
                                <InputText onChange={(e) => setName(e.target.value)} id="email" type="text" className="w-full md:w-25rem" placeholder="Correo" />
                            </span>
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-lock z-2"></i>
                                <Password onChange={(e) => setEmail(e.target.value)} id="password" type="password" className="w-25rem" inputClassName="w-full md:w-30rem" inputStyle={{ paddingLeft: '2.5rem' }} placeholder="Contraseña" toggleMask />
                            </span>
                        </div>
                        <div className="flex align-items-center justify-content-between w-25rem">
                            <div>
                                <Checkbox inputId="ingredient4" onChange={(e) => setSaveMe(!saveMe)} name="pizza" value="true" checked={saveMe} />
                                <label htmlFor="ingredient4" className="ml-2">
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
                </div>
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
