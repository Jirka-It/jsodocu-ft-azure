import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { UserValidation } from '@validations/UserValidation';
import { Password } from 'primereact/password';
import styles from './UserModal.module.css';
import { PickList, PickListEvent } from 'primereact/picklist';
import { Dropdown } from 'primereact/dropdown';
import { findAll as findAllRoles } from '@api/roles';
import { create, findByUsername, update as updateUser } from '@api/users';

import { State } from '@enums/StateEnum';
import { Badge } from 'primereact/badge';
import { IRol } from '@interfaces/IRol';
import { states } from '@lib/data';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showInfo, showSuccess, showWarn } from '@lib/ToastMessages';
import { useSession } from 'next-auth/react';
import { ISession } from '@interfaces/ISession';
import { TokenBasicInformation } from '@lib/Token';

export default function UserModalAccount({ state, setState, update, data, account, toast }: IModalCreate) {
    const [timer, setTimer] = useState(null);
    const [name, setName] = useState<string>('');
    const { data: session } = useSession(); //data:session
    const [lastName, setLastName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [stateUser, setStateUser] = useState<any>(states[0]);
    const [accountId, setAccountId] = useState<any>(account);
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [source, setSource] = useState<Array<IRol>>([]);
    const [target, setTarget] = useState([]);
    const [allRoles, setAllRoles] = useState<Array<IRol>>([]);
    const [sourceFilterValue, setSourceFilterValue] = useState<string>('');
    const [targetFilterValue, setTargetFilterValue] = useState('');

    useEffect(() => {
        getData();
    }, [data]);

    useEffect(() => {
        if (data) {
            setName(data.name);
            setLastName(data.lastName);
            setUsername(data.username);
            setAccountId(data.accountId);
            const state = states.filter((s) => s.code === data.state);
            setStateUser(state[0]);
            setTarget(data.roles ?? []);
        } else {
            setName('');
            setLastName('');
            setUsername('');
            setAccountId(account);
            setStateUser(states[0]);
            setTarget([]);
        }
    }, [data]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Usuario</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Guardar" onClick={() => handleSubmit()} />
        </div>
    );

    const getData = async (page: number = 1, size: number = 100, state: string = State.ACTIVE) => {
        let resRoles = { data: allRoles };
        if (!allRoles || allRoles.length === 0) {
            resRoles = await findAllRoles({ page, size, applyToAccount: true });
        }

        if (data && resRoles.data) {
            setAllRoles(resRoles.data);
            const rolesFormatted = data.roles.map((i) => i._id);
            const dataFiltered = resRoles.data.filter((r) => !rolesFormatted.includes(r._id));

            setSource(dataFiltered);
        } else {
            setAllRoles(resRoles.data);
            setSource(resRoles.data);
        }
    };

    // Inputs events
    const handleChange = async (username: string) => {
        setUsername(username);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await findByUsername(username);
                if (!res) {
                    showWarn(toast, '', 'Ya existe un usuario con este correo');
                } else {
                    showInfo(toast, '', 'Usuario disponible');
                }
            } catch (error) {
                showError(toast, '', 'Contacte con soporte');
            }
        }, 1000);

        setTimer(newTimer);
    };

    // PickList events
    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const onSourceFilterChange = (event: PickListEvent) => {
        setSourceFilterValue(event.value);
    };

    const onTargetFilterChange = (event: PickListEvent) => {
        setTargetFilterValue(event.value);
    };

    const handleSubmit = async () => {
        let newTarget = []; //Array with IDs
        if (target && target.length > 0) {
            newTarget = target.map((t) => t._id);
        }

        //Validate data
        var validationFlow = null;
        if (data) {
            validationFlow = ValidationFlow(
                UserValidation({
                    name,
                    lastName,
                    username,
                    state: stateUser.code,
                    roles: newTarget
                }),
                toast
            );
        } else {
            validationFlow = ValidationFlow(
                UserValidation({
                    name,
                    lastName,
                    username,
                    password,
                    state: stateUser.code,
                    confirmPassword,
                    roles: newTarget
                }),
                toast
            );
        }

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const v: ISession = session as any;
        const decoded = TokenBasicInformation(v.access_token);

        var res;

        if (data) {
            res = await updateUser(data._id, {
                name,
                lastName,
                username,
                accountId,
                state: stateUser.code,
                roles: newTarget
            });
        } else {
            res = await create({
                name,
                lastName,
                username,
                password,
                accountId,
                state: stateUser.code,
                roles: newTarget,
                creator: decoded.sub
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Usuario creado');
            update(!data ? 1 : null);
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
        setStateUser(states[0]);
        setAccountId('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setTarget([]);
        setValidations([]);
        setState(!state);
    };

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '70rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div className="flex flex-column gap-4">
                <div className="grid">
                    <div className="col-12 sm:col-6">
                        <label htmlFor="name">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                    </div>
                    <div className="col-12 sm:col-6">
                        <label htmlFor="lastName">
                            Apellido <span className="text-red-500">*</span>
                        </label>

                        <InputText value={lastName} onChange={(e) => setLastName(e.target.value)} id="lastName" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'lastName') ? 'p-invalid' : ''} `} placeholder="Apellido" />
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 sm:col-6">
                        <label htmlFor="email">
                            Correo <span className="text-red-500">*</span>
                        </label>

                        <InputText value={username} onChange={(e) => handleChange(e.target.value)} id="username" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'username') ? 'p-invalid' : ''} `} placeholder="Correo" />
                    </div>

                    <div className="col-12 sm:col-6">
                        <label htmlFor="state">
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={stateUser}
                            onChange={(e: any) => setStateUser(e.value)}
                            options={states}
                            id="state"
                            optionLabel="name"
                            placeholder="Estado"
                            className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'state') ? 'p-invalid' : ''} `}
                        />{' '}
                    </div>
                </div>

                <div className="grid">
                    {!data ? (
                        <>
                            <div className="col-12 sm:col-6">
                                {' '}
                                <label htmlFor="email">
                                    Contraseña <span className="text-red-500">*</span>
                                </label>
                                <Password
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                    type="password"
                                    className={`${styles['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'password') ? 'p-invalid' : ''} `}
                                    placeholder="Contraseña"
                                    toggleMask
                                />
                            </div>

                            <div className="col-12 sm:col-6">
                                <label htmlFor="email">
                                    Confirmar contraseña <span className="text-red-500">*</span>
                                </label>

                                <Password
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    id="confirmPassword"
                                    type="password"
                                    className={`${styles['input-password']} w-full mt-2 ${VerifyErrorsInForms(validations, 'confirmPassword') ? 'p-invalid' : ''} `}
                                    placeholder="Contraseña"
                                    feedback={false}
                                    toggleMask
                                />
                            </div>
                        </>
                    ) : (
                        ''
                    )}
                </div>

                <div>
                    <label htmlFor="category">Roles</label>
                    <PickList
                        className="mt-2"
                        itemTemplate={(item) => (
                            <div className="flex">
                                <Badge className="mr-2" value={item.code} severity="success"></Badge>
                                <p>{item.name}</p>
                            </div>
                        )}
                        showSourceControls={false}
                        showTargetControls={false}
                        showSourceFilter={true}
                        showTargetFilter={true}
                        dataKey="code"
                        source={source}
                        target={target}
                        onChange={onChange}
                        onSourceFilterChange={onSourceFilterChange}
                        onTargetFilterChange={onTargetFilterChange}
                        filter
                        filterBy="name"
                        sourceFilterValue={sourceFilterValue}
                        targetFilterValue={targetFilterValue}
                        sourceFilterPlaceholder="Buscar por nombre"
                        targetFilterPlaceholder="Buscar por nombre"
                        breakpoint="960px"
                        sourceHeader="Disponibles"
                        targetHeader="Seleccionados"
                        sourceStyle={{ height: '24rem' }}
                        targetStyle={{ height: '24rem' }}
                    />
                </div>
            </div>
        </Dialog>
    );
}
