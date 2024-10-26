import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';

export default function StepInfo() {
    const [adminName, setAdminName] = useState<string>('');
    const [corporateEmail, setCorporateEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [alternateEmail, setAlternateEmail] = useState<string>('');

    const handleSubmit = async () => {};

    return (
        <div className="grid mt-5">
            <div className="col-12 md:col-5">
                <div className="flex flex-column gap-4">
                    <div>
                        <label htmlFor="adminName" className="font-bold">
                            Nombre de administrador
                        </label>
                        <InputText value={adminName} onChange={(e) => setAdminName(e.target.value)} id="adminName" type="text" className="w-full" placeholder=" Nombre de administrador" />
                    </div>

                    <div>
                        <label htmlFor="corporateEmail" className="font-bold">
                            Correo corporativo
                        </label>
                        <InputText value={corporateEmail} onChange={(e) => setCorporateEmail(e.target.value)} id="corporateEmail" type="text" className="w-full" placeholder="Correo corporativo" />
                    </div>

                    <div>
                        <label htmlFor="phone" className="font-bold">
                            Teléfono
                        </label>
                        <InputText value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" type="text" className="w-full" placeholder="Teléfono" />
                    </div>

                    <div>
                        <label htmlFor="alternateEmail" className="font-bold">
                            Correo alternativo
                        </label>
                        <InputText value={alternateEmail} onChange={(e) => setAlternateEmail(e.target.value)} id="alternateEmail" type="text" className="w-full" placeholder="Correo alternativo" />
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-7">
                <h4 className="font-bold flex justify-content-end text-blue-500">Permisos</h4>

                <div>
                    <p className="flex justify-content-end align-items-center">
                        Puede crear documentos <RadioButton inputId="1" className="ml-3" checked={true} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Puede editar documentos <RadioButton inputId="2" className="ml-3" checked={true} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Puede solicitar validaciones
                        <RadioButton inputId="3" className="ml-3" checked={true} />
                    </p>
                    <p className="flex justify-content-end align-items-center">
                        Puede crear usuarios <RadioButton inputId="4" className="ml-3" checked={true} />
                    </p>
                </div>
            </div>
            <div className="w-full flex justify-content-end mt-5">
                <Button label="Guardar" onClick={() => handleSubmit()} />
            </div>
        </div>
    );
}
