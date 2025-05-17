import React, { useEffect, useRef, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { newFile } from '@lib/File';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

import Image from 'next/image';
import { env } from '@config/env';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { findDashboard, update } from '@api/users';
import { create as createImage, findFile, remove as removeImage } from '@api/file';

import { showError, showSuccess } from '@lib/ToastMessages';
import { HttpStatus } from '@enums/HttpStatusEnum';

import styles from '../Cards/BasicInformationCard.module.css';
import stylesUser from './UserModal.module.css';
import { PasswordValidation } from '@validations/PasswordValidation';
import { UserProfileValidation } from '@validations/UserProfileValidation';
import { IUserDashboard } from '@interfaces/IUser';

export default function ProfileModal({ state, setState, toast }: IModalCreate) {
    const inputFile = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<string>();
    const [user, setUser] = useState<IUserDashboard>();
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [account, setAccount] = useState<string>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await findDashboard();
        if (res.status === HttpStatus.OK) {
            setUser(res);
            setName(res.name);
            setLastName(res.lastName);
            setEmail(res.username);
            setAccount(res.account);
            const resImage = await findFile({ filePath: res.photo });
            setFile(URL.createObjectURL(resImage));
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Mi Perfil</span>
        </div>
    );

    // File
    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const handleChange = async (e) => {
        const bodyFormData = new FormData();
        const fileRenamed = await newFile('SODOCU_AVATAR', e.target.files[0]);
        bodyFormData.append('file', fileRenamed);
        const res = await createImage(bodyFormData);

        if (res.status === HttpStatus.CREATED) {
            const filePath = res.filePath;
            const resImage = await findFile({ filePath: filePath });
            // Set file
            setFile(URL.createObjectURL(resImage));

            // Update file
            await update(user.id, {
                photo: filePath
            });

            //Delete old image
            if (file) {
                await removeImage({ filePath: file });
            }
            showSuccess(toast, '', 'Imagen actualizada');
        } else {
            showError(toast, '', 'La imagen no ha sido actualizada');
        }
    };

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            UserProfileValidation({
                name,
                lastName
                //template: template.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const res = await update(user.id, { name, lastName });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Usuario actualizado');
            handleClose();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleSubmitPassword = async () => {
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

        const res = await update(user.id, { password });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Contraseña actualizada');
            handleClose();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setName('');
        setLastName('');
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
            closable={false}
            style={{ width: '40rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div className="modal-profile flex flex-column gap-4">
                <div className={`${styles['avatar-background']} flex justify-content-center`}>
                    <div className="avatar-background-div-input relative">
                        {!file ? (
                            <div>
                                <input className="avatar-background-input" accept=".jpg, .jpeg, .png" type="file" onChange={handleChange} ref={inputFile} />
                                <i className="pi pi-image"></i>
                            </div>
                        ) : (
                            <div>
                                <Image src={`${file}` || ''} width={500} height={500} alt="Avatar" onClick={onFileUploadClick} />
                                <input accept=".jpg, .jpeg, .png" className=" hidden" type="file" onChange={handleChange} ref={inputFile} />
                                <i className="pi pi-image"></i>
                            </div>
                        )}
                    </div>
                </div>

                <TabView>
                    <TabPanel leftIcon="pi pi-user mr-2" header="Información">
                        <div className="grid">
                            <div className="col-12 sm:col-6">
                                <label htmlFor="name">
                                    Nombre <span className="text-red-500">*</span>
                                </label>

                                <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                            </div>

                            <div className="col-12 sm:col-6">
                                <label htmlFor="name">
                                    Apellido <span className="text-red-500">*</span>
                                </label>

                                <InputText
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    id="lastName"
                                    type="text"
                                    className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'lastName') ? 'p-invalid' : ''} `}
                                    placeholder="Apellido"
                                />
                            </div>
                        </div>

                        <div className="grid mt-2">
                            <div className="col-12 sm:col-6">
                                <label htmlFor="name">
                                    Correo <span className="text-red-500">*</span>
                                </label>

                                <InputText disabled value={email} id="email" type="text" className="w-full mt-2" placeholder="Correo" />
                            </div>

                            <div className="col-12 sm:col-6">
                                <label htmlFor="name">
                                    Cuenta <span className="text-red-500">*</span>
                                </label>

                                <InputText disabled value={account} id="account" type="text" className="w-full mt-2" placeholder="Cuenta" />
                            </div>
                        </div>

                        <div className=" mt-4 flex align-items-center justify-content-center">
                            <Button className="mr-2" label="Cancelar" severity="danger" onClick={() => handleClose()} />
                            <Button label="Guardar" onClick={() => handleSubmit()} />
                        </div>
                    </TabPanel>
                    <TabPanel leftIcon="pi pi-key mr-2" header="Contraseña">
                        <Message
                            className="w-full justify-content-start mb-3"
                            text="Username is required"
                            content={
                                <div>
                                    <p className="mb-0">Al menos 8 caracteres de largo</p>
                                    <p className="mb-0">Use una mezcla de minúsculas y mayúsculas</p>
                                    <p className="mb-0">Incluya números y caracteres especiales</p>
                                </div>
                            }
                        />

                        <div className="grid">
                            <div className="col-12 sm:col-6">
                                <label htmlFor="email">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    className={`${stylesUser['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                                    placeholder="Contraseña"
                                    toggleMask
                                />
                            </div>

                            <div className="col-12 sm:col-6">
                                <label htmlFor="confirmPassword">
                                    Confirmar contraseña <span className="text-red-500">*</span>
                                </label>

                                <Password
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    id="confirmPassword"
                                    type="password"
                                    className={`${stylesUser['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'confirmPassword') ? 'p-invalid' : ''} `}
                                    placeholder="Contraseña"
                                    feedback={false}
                                    toggleMask
                                />
                            </div>
                        </div>
                        <div className=" mt-4 flex align-items-center justify-content-center">
                            <Button className="mr-2" label="Cancelar" severity="danger" onClick={() => handleClose()} />
                            <Button label="Guardar" onClick={() => handleSubmitPassword()} />
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </Dialog>
    );
}
