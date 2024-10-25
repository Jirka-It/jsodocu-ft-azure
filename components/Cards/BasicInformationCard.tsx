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

export default function BasicInformationForm() {
    const inputFile = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);

    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const onFileUploadClick = () => {
        inputFile?.current.click();
    };

    const [validations, setValidations] = useState<Array<IZodError>>([]);

    return (
        <section>
            <ReactImageCropModal state={openModal} setState={(e) => setOpenModal(e)} />
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
                            <InputText id="name" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Escribe aquí tu nombre o razón social" />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="nit" className="font-bold">
                            NIT
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText id="nit" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'nit') ? 'p-invalid' : ''} `} placeholder="Escribe aquí el NIT si eres empresa" />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="website" className="font-bold">
                            Sitio web <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText id="website" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'website') ? 'p-invalid' : ''} `} placeholder="Escribe aquí la dirección de tu sitio WEB" />
                        </span>
                    </div>

                    <div>
                        <label htmlFor="city" className="font-bold">
                            Ciudad <span className="text-red-500">*</span>
                        </label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock"></i>
                            <InputText id="city" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'city') ? 'p-invalid' : ''} `} placeholder="Escribe aquí la dirección de tu sitio WEB" />
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
                        <InputTextarea id="description" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'description') ? 'p-invalid' : ''} `} placeholder="Descripción" rows={5} cols={30} />
                    </div>

                    <div className="flex justify-content-end">
                        <Button label="Guardar" />
                    </div>
                </div>
            </Card>
        </section>
    );
}
