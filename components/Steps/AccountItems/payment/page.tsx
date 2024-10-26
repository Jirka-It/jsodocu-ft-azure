import { IZodError } from '@interfaces/IAuth';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Button } from 'primereact/button';

export default function StepPayment() {
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [month, setMonth] = useState<Nullable<Date>>(null);
    const [year, setYear] = useState<Nullable<Date>>(null);
    const [code, setCode] = useState<string>('');

    const toast = useRef(null);

    const handleSubmit = async () => {};

    return (
        <section>
            <Toast ref={toast} />
            <div className="grid mt-5 flex flex-column">
                <div className="w-full flex justify-content-end mt-5">
                    <Button severity="secondary" icon="pi pi-plus" iconPos="right" label="Mantener gratis" onClick={() => handleSubmit()} />
                </div>
                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <label htmlFor="name" className="font-bold">
                                Nombre del titular
                            </label>
                            <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre del titular" />
                        </div>

                        <div className="col-12 md:col-6">
                            <label htmlFor="lastName" className="font-bold">
                                Apellido del titular
                            </label>
                            <InputText
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                id="lastName"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'lastName') ? 'p-invalid' : ''} `}
                                placeholder="Apellido del titular"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <label htmlFor="cardNumber" className="font-bold">
                                Numero de la tarjeta
                            </label>
                            <InputText
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                id="cardNumber"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'cardNumber') ? 'p-invalid' : ''} `}
                                placeholder="Numero de la tarjeta"
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <label htmlFor="email" className="font-bold">
                                Correo para facturación
                            </label>
                            <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'email') ? 'p-invalid' : ''} `} placeholder="Apellido del titular" />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <label htmlFor="month" className="font-bold">
                        Fecha de vencimiento
                    </label>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <Calendar id="month" value={month} onChange={(e) => setMonth(e.value)} view="month" dateFormat="mm" className={`w-full ${VerifyErrorsInForms(validations, 'month') ? 'p-invalid' : ''} `} placeholder="MMMM" />
                        </div>

                        <div className="col-12 md:col-6">
                            <Calendar id="year" value={year} onChange={(e) => setYear(e.value)} view="year" dateFormat="yy" className={`w-full ${VerifyErrorsInForms(validations, 'year') ? 'p-invalid' : ''} `} placeholder="AAAA" />
                        </div>
                    </div>
                </div>

                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <label htmlFor="cardNumber" className="font-bold">
                                Código de seguridad
                            </label>
                            <InputText value={code} onChange={(e) => setCode(e.target.value)} id="code" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'code') ? 'p-invalid' : ''} `} placeholder="Código de seguridad" />
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-content-center mt-5">
                    <Button severity="danger" label="Cancelar suscripción" onClick={() => handleSubmit()} />
                    <Button className="ml-4" icon="pi pi-plus" iconPos="right" label="Activar premium" onClick={() => handleSubmit()} />
                </div>
            </div>
        </section>
    );
}
