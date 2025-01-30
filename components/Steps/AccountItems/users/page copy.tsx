import DeleteModal from '@components/Modals/DeleteModal';
import BasicActions from '@components/TableExtensions/BasicActions';
import BasicStates from '@components/TableExtensions/BasicStates';
import { State } from '@enums/StateEnum';
import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { AccountValidation } from '@validations/AccountValidation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';

export default function StepUsers() {
    const toast = useRef(null);
    const [openModalClose, setOpenModalClose] = useState<boolean>(false);
    const [checked, setChecked] = useState(false);
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [username, setUsername] = useState<string>('');
    const [corporateEmail, setCorporateEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [role, setRole] = useState('');

    const [users, setUsers] = useState([
        {
            id: 55,
            name: 'Jonathan Peña.',
            state: State.INACTIVE,
            actions: ''
        },
        {
            id: 56,
            name: 'Jonathan Peña.',
            state: State.ACTIVE,
            actions: ''
        },
        {
            id: 57,
            name: 'Jonathan Peña.',
            state: State.INACTIVE,
            actions: ''
        },
        {
            id: 58,
            name: 'Jonathan Peña.',
            state: State.ACTIVE,
            actions: ''
        }
    ]);

    const handleSubmit = async () => {
        //Validate data
        /* const validationFlow = ValidationFlow(
            AccountValidation({
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
        }*/
    };

    const handleEdit = (id: string) => {};

    const handleDelete = (id: string) => {
        setOpenModalClose(true);
    };

    return (
        <section>
            <Toast ref={toast} />
            {/*
            <div className="grid mt-5">
                <div className="col-12 md:col-5">
                    <div className="flex flex-column gap-4">
                        <div>
                            <label htmlFor="username" className="font-bold">
                                Nombre de usuario
                            </label>
                            <InputText
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                id="username"
                                type="text"
                                className={`w-full ${VerifyErrorsInForms(validations, 'username') ? 'p-invalid' : ''} `}
                                placeholder="Nombre de usuario"
                            />
                        </div>

                        <div>
                            <label htmlFor="corporateEmail" className="font-bold">
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
                            <label htmlFor="password" className="font-bold">
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
                        <div className="flex justify-content-end align-items-center mb-2">
                            <p className="m-0">Abogado</p> <RadioButton inputId="1" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="lawyer" onChange={(e) => setRole(e.value)} checked={role === 'lawyer'} />
                        </div>
                        <div className="flex justify-content-end align-items-center mb-2">
                            <p className="m-0">Comercial</p>{' '}
                            <RadioButton inputId="2" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="commercial" onChange={(e) => setRole(e.value)} checked={role === 'commercial'} />
                        </div>
                        <div className="flex justify-content-end align-items-center mb-2">
                            <p className="m-0">Operativo</p>
                            <RadioButton inputId="3" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="operative" onChange={(e) => setRole(e.value)} checked={role === 'operative'} />
                        </div>
                        <div className="flex justify-content-end align-items-center mb-2">
                            <p className="m-0">Usuario</p> <RadioButton inputId="4" className={`${VerifyErrorsInForms(validations, 'role') ? 'p-invalid' : ''} ml-3`} value="user" onChange={(e) => setRole(e.value)} checked={role === 'user'} />
                        </div>
                    </div>
                </div>{' '}
                <div className="w-full flex justify-content-end mt-5">
                    <Button label="Guardar" onClick={() => handleSubmit()} />
                </div>
            </div>
           */}

            {/*
  onClick={() => {
                            setOpenModal(true);
                            setUser(null);
                        }}
*/}
            <div className="grid">
                <div className="col-12">
                    <div className="w-full flex justify-content-between mb-5">
                        <Button icon="pi pi-plus" className="mr-2" label="Usuario" />
                        <InputSwitch checked={checked} onChange={(e) => setChecked(e.value)} />
                    </div>

                    <DeleteModal toast={toast} state={openModalClose} setState={(e) => setOpenModalClose(e)} api={() => console.log('')} update={() => console.log('')} />
                    <DataTable value={users} paginator rows={10} onPage={(e) => console.log(e)}>
                        <Column field="id" header="ID"></Column>
                        <Column field="name" header="Nombre"></Column>
                        <Column field="state" body={(rowData) => <BasicStates state={rowData?.state} />} header="Estado"></Column>
                        <Column field="actions" body={(rowData) => <BasicActions handleEdit={() => handleEdit(rowData?.id)} handleDelete={() => handleDelete(rowData?.id)} />} header="Acciones"></Column>
                    </DataTable>
                </div>
            </div>
        </section>
    );
}
