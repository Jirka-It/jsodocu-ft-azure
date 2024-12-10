import { IZodError } from '@interfaces/IAuth';
import Image from 'next/image';

import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect, useRef, useState } from 'react';

import styles from './BasicInformationCard.module.css';
import ReactImageCropModal from '@components/Modals/ReactImageCropModal';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { BasicInformationValidation } from '@validations/BasicInformationValidation';
import { findById, update } from '@api/accounts';
import { useParams } from 'next/navigation';
import { IAccount } from '@interfaces/IAccount';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showSuccess } from '@lib/ToastMessages';

export default function BasicInformationForm() {
    const params = useParams();
    const inputFile = useRef<HTMLInputElement>(null);
    const toast = useRef(null);
    const [account, setAccount] = useState<IAccount>();
    const [file, setFile] = useState<string>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [name, setName] = useState<string>('');
    const [nit, setNit] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [alternateEmail, setAlternateEmail] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await findById(params.id);
            setAccount(res);
            setName(res.name);
            setNit(res.nit);
            setEmail(res.email);
            setAlternateEmail(res.alternateEmail);
            setWebsite(res.website);
            setCity(res.city);
            setDescription(res.description);
        } catch (error) {}
    };

    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            BasicInformationValidation({
                name,
                nit,
                email,
                alternateEmail,
                website,
                city
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const res = await update(account._id, {
            name,
            nit,
            email,
            alternateEmail,
            website,
            city,
            description
        });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Información actualizada');
            setTimeout(() => {}, 1000);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <section>
            <Toast ref={toast} />
            <ReactImageCropModal state={openModal} setState={(e) => setOpenModal(e)} /> {/* This code is, if the people wants crop the image */}
            <Card>
                <div className="mb-5">
                    <div className={`${styles['avatar-background']} flex justify-content-center`}>
                        <div className="avatar-background-div-input relative">
                            {!file ? (
                                <div>
                                    <input className="avatar-background-input" type="file" onChange={handleChange} ref={inputFile} />
                                    <i className="pi pi-image"></i>
                                </div>
                            ) : (
                                <div>
                                    <Image src={file} width={500} height={500} alt="Avatar" onClick={onFileUploadClick} />
                                    <input className=" hidden" type="file" onChange={handleChange} ref={inputFile} />
                                    <i className="pi pi-image"></i>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-center font-bold mt-2">Administrador</p>
                </div>

                <div className="flex flex-column gap-4">
                    <div>
                        <label htmlFor="name" className="font-bold">
                            Nombre o razón social <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-cog"></i>
                            <InputText
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `}
                                placeholder="Escribe aquí tu nombre o razón social"
                            />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="email" className="font-bold">
                            Correo <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-cog"></i>
                            <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Escribe aquí tu correo" />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="alternateEmail" className="font-bold">
                            Correo alternativo <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-cog"></i>
                            <InputText
                                value={alternateEmail}
                                onChange={(e) => setAlternateEmail(e.target.value)}
                                id="alternateEmail"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'alternateEmail') ? 'p-invalid' : ''} `}
                                placeholder="Escribe aquí tu correo alternativo"
                            />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="nit" className="font-bold">
                            NIT <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText value={nit} onChange={(e) => setNit(e.target.value)} id="nit" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'nit') ? 'p-invalid' : ''} `} placeholder="Escribe aquí el NIT si eres empresa" />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="website" className="font-bold">
                            Sitio web <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                id="website"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'website') ? 'p-invalid' : ''} `}
                                placeholder="Escribe aquí la dirección de tu sitio WEB"
                            />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="city" className="font-bold">
                            Ciudad <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText value={city} onChange={(e) => setCity(e.target.value)} id="city" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'city') ? 'p-invalid' : ''} `} placeholder="Escribe aquí tu ciudad" />
                        </span>
                    </div>

                    <div className="w-full">
                        <label htmlFor="description" className="flex justify-content-between">
                            <p className="font-bold">
                                <i className="pi pi-exclamation-circle mr-2"></i>
                                Descripción
                            </p>
                            <p>Describe tu experiencia</p>
                        </label>
                        <InputTextarea value={description ?? account?.description} onChange={(e) => setDescription(e.target.value)} id="description" className="w-full mt-2" placeholder="Descripción" rows={5} cols={30} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button label="Guardar" onClick={() => handleSubmit()} />
                    </div>
                </div>
            </Card>
        </section>
    );
}
