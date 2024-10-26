import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { UserAccountValidation } from '@validations/UserAccountValidation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export default function StepUsers() {
    const toast = useRef(null);
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [username, setUsername] = useState<string>('');
    const [corporateEmail, setCorporateEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState('');

    const handleSubmit = async () => {
        //Validate data
        const validationFlow = ValidationFlow(
            UserAccountValidation({
                username,
                corporateEmail,
                phone,
                password,
                role
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
        <div className="grid mt-5">
            <Toast ref={toast} />
            <div className="col-12 md:col-5">
                <div className="flex flex-column gap-4">
                    <div>
                        <label htmlFor="nit" className="font-bold">
                            Nombre de usuario
                        </label>
                        <InputText
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id="username"
                            type="text"
                            className={`w-full ${VerifyErrorsInForms(validations, 'username') ? 'p-invalid' : ''} `}
                            placeholder=" Nombre de administrador"
                        />
                    </div>

                    <div>
                        <label htmlFor="nit" className="font-bold">
                            Correo corporativo
                        </label>
                        <InputText
                            value={corporateEmail}
                            onChange={(e) => setCorporateEmail(e.target.value)}
                            id="corporateEmail"
                            type="text"
                            className={`w-full ${VerifyErrorsInForms(validations, 'corporateEmail') ? 'p-invalid' : ''} `}
                            placeholder="Correo corporativo"
                        />
                    </div>

                    <div>
                        <label htmlFor="nit" className="font-bold">
                            Teléfono
                        </label>
                        <InputText value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" type="text" className={`w-full ${VerifyErrorsInForms(validations, 'phone') ? 'p-invalid' : ''} `} placeholder="Teléfono" />
                    </div>

                    <div>
                        <label htmlFor="nit" className="font-bold">
                            Contraseña
                        </label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className={`w-full ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                            inputClassName="w-full"
                            placeholder="Contraseña"
                            toggleMask
                        />{' '}
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-7">
                <h4 className="font-bold flex justify-content-end text-blue-500">Roles disponibles</h4>

                <div>
                    <p className="flex justify-content-end align-items-center">
                        Abogado <RadioButton inputId="1" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="lawyer" onChange={(e) => setRole(e.value)} checked={role === 'lawyer'} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Comercial <RadioButton inputId="2" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="commercial" onChange={(e) => setRole(e.value)} checked={role === 'commercial'} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Operativo
                        <RadioButton inputId="3" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="operative" onChange={(e) => setRole(e.value)} checked={role === 'operative'} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Usuario <RadioButton inputId="4" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="user" onChange={(e) => setRole(e.value)} checked={role === 'user'} />
                    </p>
                </div>
            </div>{' '}
            <div className="w-full flex justify-content-end mt-5">
                <Button label="Guardar" onClick={() => handleSubmit()} />
            </div>
        </div>
    );
}
