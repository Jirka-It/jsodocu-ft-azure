import { IZodError } from '@interfaces/IAuth';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Button } from 'primereact/button';
import { ValidationFlow } from '@lib/ValidationFlow';
import { PaymentAccountValidation } from '@validations/PaymentAccount';
import { InputNumber } from 'primereact/inputnumber';
import { addLocale } from 'primereact/api';

addLocale('es', {
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
});

export default function StepPayment() {
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<number>(null);
    const [email, setEmail] = useState<string>('');
    const [month, setMonth] = useState<Nullable<Date>>(null);
    const [year, setYear] = useState<Nullable<Date>>(null);
    const [code, setCode] = useState<number>(null);

    const toast = useRef(null);

    const handleCancel = async () => {};
    const handleFree = async () => {};

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            PaymentAccountValidation({
                name,
                lastName,
                cardNumber,
                email,
                month,
                year,
                code
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
            <div className="grid mt-5 flex flex-column">
                <div className="w-full flex justify-content-end mt-5">
                    <Button severity="secondary" icon="pi pi-plus" iconPos="right" label="Mantener gratis" onClick={() => handleFree()} />
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

                            <InputNumber
                                value={cardNumber}
                                onValueChange={(e) => setCardNumber(e.value)}
                                id="cardNumber"
                                className={`w-full ${VerifyErrorsInForms(validations, 'cardNumber') ? 'p-invalid' : ''} `}
                                placeholder="Numero de la tarjeta"
                                useGrouping={false}
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
                            <Calendar id="month" value={month} onChange={(e) => setMonth(e.value)} view="month" dateFormat="mm" locale="es" className={`w-full ${VerifyErrorsInForms(validations, 'month') ? 'p-invalid' : ''} `} placeholder="MMMM" />
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

                            <InputNumber value={code} onValueChange={(e) => setCode(e.value)} id="code" className={`w-full ${VerifyErrorsInForms(validations, 'code') ? 'p-invalid' : ''} `} placeholder="Código de seguridad" useGrouping={false} />
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-content-center mt-5">
                    <Button severity="danger" label="Cancelar suscripción" onClick={() => handleCancel()} />
                    <Button className="ml-4" icon="pi pi-plus" iconPos="right" label="Activar premium" onClick={() => handleSubmit()} />
                </div>
            </div>
        </section>
    );
}
