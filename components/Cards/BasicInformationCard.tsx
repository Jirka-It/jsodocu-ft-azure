import { IZodError } from '@interfaces/IAuth';
import Image from 'next/image';

import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useRef, useState } from 'react';

import styles from './BasicInformationCard.module.css';
import ReactImageCropModal from '@components/Modals/ReactImageCropModal';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { BasicInformationValidation } from '@validations/BasicInformationValidation';

export default function BasicInformationForm() {
    const inputFile = useRef<HTMLInputElement>(null);
    const toast = useRef(null);
    const [file, setFile] = useState<string>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    const [name, setName] = useState<string>('');
    const [nit, setNit] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [description, setDescription] = useState<string>('');

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
                            Nombre o razón social<span className="text-red-500">*</span>
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
                        <label htmlFor="nit" className="font-bold">
                            NIT
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText value={nit} onChange={(e) => setNit(e.target.value)} id="nit" type="text" className="w-full" placeholder="Escribe aquí el NIT si eres empresa" />
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
                        <InputTextarea value={description} onChange={(e) => setDescription(e.target.value)} id="description" className="w-full mt-2" placeholder="Descripción" rows={5} cols={30} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button label="Guardar" onClick={() => handleSubmit()} />
                    </div>
                </div>
            </Card>
        </section>
    );
}
