'use client';

import React, { forwardRef, useImperativeHandle, useContext, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { env } from '@config/env';

import Link from 'next/link';
import AppBreadCrumb from './AppBreadCrumb';
import { LayoutContext } from './context/layoutcontext';
import AppSidebar from './AppSidebar';
import { StyleClass } from 'primereact/styleclass';
import { Ripple } from 'primereact/ripple';
import { signOut, useSession } from 'next-auth/react';
import { ISession } from '@interfaces/ISession';
import { IUser } from '@interfaces/IUser';
import { TokenBasicInformation } from '@lib/Token';

const AppTopbar = forwardRef((props: { sidebarRef: React.RefObject<HTMLDivElement> }, ref) => {
    const { data: session } = useSession(); //data:session
    const [user, setUser] = useState<IUser>();

    const btnRef2 = useRef(null);
    const menubuttonRef = useRef(null);

    useEffect(() => {
        const data: ISession = session as any;
        const decoded = TokenBasicInformation(data.access_token);

        setUser(decoded.user);
    }, [session]);

    const { onMenuToggle, layoutConfig } = useContext(LayoutContext);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));

    const handleLogout = () => {
        signOut({ callbackUrl: '/auth/login', redirect: true });
    };

    return (
        <div className="layout-topbar">
            <div className="topbar-left">
                <button ref={menubuttonRef} type="button" className="menu-button p-link" onClick={onMenuToggle}>
                    <i className="pi pi-chevron-left"></i>
                </button>

                <Link href="/" className="horizontal-logo">
                    <img id="logo-horizontal" src={`/layout/images/logo-${layoutConfig.menuTheme === 'white' || layoutConfig.menuTheme === 'orange' ? 'dark' : 'white'}.svg`} alt="diamond-layout" />
                </Link>

                <span className="topbar-separator"></span>

                <AppBreadCrumb />
                <img src={`/layout/images/sodocu-black.svg`} className="mobile-logo" alt="logo-layout" />
            </div>
            <div className="layout-topbar-menu-section">
                <AppSidebar sidebarRef={props.sidebarRef} />
            </div>
            <div className="layout-mask modal-in"></div>

            <div className="topbar-right">
                <ul className="topbar-menu">
                    {/*
                    <li className="static sm:relative">
                        <StyleClass nodeRef={btnRef1} selector="@next" enterClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick>
                            <a tabIndex={0} ref={btnRef1}>
                                <i className="pi pi-bell"></i>
                                <span className="topbar-badge">5</span>
                            </a>
                        </StyleClass>
                        <ul className="list-none p-3 m-0 border-round shadow-2 absolute surface-overlay hidden origin-top w-full sm:w-19rem mt-2 right-0 z-5 top-auto">
                            <li>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-shopping-cart mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">New Order</span>
                                        <span className="text-color-secondary">
                                            You have <strong>3</strong> new orders.
                                        </span>
                                    </span>
                                    <Ripple />
                                </a>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-check-square mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">Withdrawn Completed</span>
                                        <span className="text-color-secondary">Funds are on their way.</span>
                                    </span>
                                    <Ripple />
                                </a>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-chart-line mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">Monthly Reports</span>
                                        <span className="text-color-secondary">Monthly Reports are ready.</span>
                                    </span>
                                    <Ripple />
                                </a>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-comments mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">Comments</span>
                                        <span className="text-color-secondary">
                                            <strong>2</strong> new comments.
                                        </span>
                                    </span>
                                    <Ripple />
                                </a>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-exclamation-circle mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">Chargeback Request</span>
                                        <span className="text-color-secondary">
                                            <strong>1</strong> to review.
                                        </span>
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>

                  */}

                    <li className="profile-item static sm:relative">
                        <StyleClass nodeRef={btnRef2} selector="@next" enterClassName="hidden" enterActiveClassName="scalein" leaveToClassName="hidden" leaveActiveClassName="fadeout" hideOnOutsideClick={true}>
                            <a tabIndex={1} ref={btnRef2}>
                                {user?.accountPhoto ? (
                                    <Image className="border-circle mr-2" src={`${env.NEXT_PUBLIC_API_URL_BACKEND}/${user.accountPhoto}` || ''} width={40} height={40} alt="Avatar" />
                                ) : (
                                    <i className="pi pi-user mr-2" style={{ fontSize: '2rem' }}></i>
                                )}

                                {user ? <span className="profile-name">{`${user.name} ${user.lastName ?? ''}`}</span> : ''}
                            </a>
                        </StyleClass>
                        <ul className="list-none p-3 m-0 border-round shadow-2 absolute surface-overlay hidden origin-top w-full sm:w-19rem mt-2 right-0 z-5 top-auto">
                            <li>
                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
                                    <i className="pi pi-user mr-3"></i>
                                    <span className="flex flex-column">
                                        <span className="font-semibold">Perfil</span>
                                    </span>
                                    <Ripple />
                                </a>

                                <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer" onClick={handleLogout}>
                                    <i className="pi pi-power-off mr-3"></i>
                                    <span className="flex flex-column" onClick={() => handleLogout()}>
                                        <span className="font-semibold">Logout</span>
                                    </span>
                                    <Ripple />
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default AppTopbar;

AppTopbar.displayName = 'AppTopbar';
