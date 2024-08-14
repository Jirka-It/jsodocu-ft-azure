'use client';

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Page } from '@/types/layout';

const ForgotPassword: Page = () => {
    const router = useRouter();

    return (
        <>
            <div className="flex h-screen">
                <div className="w-full lg:w-4 h-full text-center px-6 py-6 flex flex-column justify-content-between">
                    <img src={`/layout/images/logo-dark.svg`} className="h-4rem mt-4" alt="diamond-layout" />
                    <div className="flex flex-column align-items-center gap-4">
                        <div className="mb-3">
                            <h2>Forgot Password</h2>
                            <p>Enter your email to reset your password</p>
                        </div>

                        <span className="p-input-icon-left w-full md:w-25rem">
                            <i className="pi pi-envelope"></i>
                            <InputText id="email" type="text" className="w-full md:w-25rem" placeholder="Email" />
                        </span>

                        <div className="flex gap-3 w-full md:w-25rem">
                            <Button outlined className="p-ripple flex-auto" onClick={() => router.push('/')} label="CANCEL"></Button>
                            <Button className="p-ripple flex-auto" onClick={() => router.push('/')} label="SUBMIT"></Button>
                        </div>
                    </div>

                    <p className="text-color-secondary font-semibold">
                        A problem? <a className="text-primary hover:underline cursor-pointer font-medium">Click here</a> and let us help you.
                    </p>
                </div>
                <div
                    className="w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat"
                    style={{
                        backgroundImage: "url('/demo/images/auth/bg-login.jpg')"
                    }}
                >
                    <div className="mt-auto mb-auto">
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
