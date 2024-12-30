import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { IModalCreate } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { RolValidation } from '@validations/RolValidation';
import { PickList, PickListEvent } from 'primereact/picklist';
import { findAll } from '@api/permissions';
import { IPermission } from '@interfaces/IPermission';
import { applyToAccounts, states } from '@lib/data';
import { CleanText } from '@lib/CleanText';
import { create, findByCode, update as updateRol } from '@api/roles';
import { showError, showInfo, showSuccess, showWarn } from '@lib/ToastMessages';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { ISession } from '@interfaces/ISession';
import { useSession } from 'next-auth/react';

export default function RolModal({ state, setState, update, data, toast }: IModalCreate) {
    const [timer, setTimer] = useState(null);
    const { data: session } = useSession(); //data:session
    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [stateRol, setStateRol] = useState<any>('');
    const [applyToAccount, setApplyToAccount] = useState<any>(null);
    const [description, setDescription] = useState<string>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [source, setSource] = useState<Array<IPermission>>([]);
    const [allPermissions, setAllPermissions] = useState<Array<IPermission>>([]);
    const [sourceFilterValue, setSourceFilterValue] = useState<string>('');
    const [targetFilterValue, setTargetFilterValue] = useState('');
    const [target, setTarget] = useState([]);

    useEffect(() => {
        getData();
    }, [data]);

    useEffect(() => {
        if (data) {
            setCode(data.code);
            setName(data.name);
            setDescription(data.description);
            const state = states.filter((s) => s.code === data.state);
            setStateRol(state[0]);
            const apply = applyToAccounts.filter((s) => s.code === data.applyToAccount);
            setApplyToAccount(apply[0]);
            setTarget(data.permissions ?? []);
        } else {
            setCode('');
            setName('');
            setDescription('');
            setStateRol(states[0]);
            setApplyToAccount(applyToAccounts[0]);
            setTarget([]);
        }
    }, [data]);

    const getData = async (page: number = 1, size: number = 1000) => {
        let res = { data: allPermissions };
        if (!allPermissions || allPermissions.length === 0) {
            res = await findAll({ page, size });
        }

        if (data && res.data) {
            setAllPermissions(res.data);
            const permissionsFormatted = data.permissions.map((i) => i._id);
            const dataFiltered = res.data.filter((r) => !permissionsFormatted.includes(r._id));
            setSource(dataFiltered);
            return;
        } else {
            setAllPermissions(res.data);
            setSource(res.data);
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Rol</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Guardar" onClick={() => handleSubmit()} />
        </div>
    );

    // Inputs events
    const handleChange = async (code: string) => {
        const newCode = CleanText(code);
        setCode(newCode);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await findByCode(newCode);
                if (!res) {
                    showWarn(toast, '', 'Ya existe un rol con este código');
                } else {
                    showInfo(toast, '', 'Código disponible');
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
        const validationFlow = ValidationFlow(
            RolValidation({
                code,
                name,
                applyToAccount: applyToAccount ? applyToAccount.code : null,
                state: stateRol.code,
                description,
                permissions: newTarget
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const v: ISession = session as any;

        var res;

        if (data) {
            res = await updateRol(data._id, {
                code,
                name,
                description,
                applyToAccount: applyToAccount.code,
                state: stateRol.code,
                permissions: newTarget
            });
        } else {
            res = await create({
                code,
                name,
                description,
                applyToAccount: applyToAccount.code,
                state: stateRol.code,
                permissions: newTarget,
                creator: v.user._id
            });
        }

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Rol creado');
            update(!data ? 1 : null);
            handleClose();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleClose = async () => {
        setCode('');
        setName('');
        setDescription('');
        setTarget([]);
        setValidations([]);
        setSource(allPermissions);
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
                        <label htmlFor="code">
                            Código <span className="text-red-500">*</span>
                        </label>
                        <InputText value={code} onChange={(e) => handleChange(e.target.value)} id="code" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'code') ? 'p-invalid' : ''} `} placeholder="Código" />
                    </div>

                    <div className="col-12 sm:col-6">
                        <label htmlFor="name">
                            Nombre <span className="text-red-500">*</span>
                        </label>

                        <InputText value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre" />
                    </div>
                </div>

                <div className="grid">
                    <div className="col-12 sm:col-6">
                        <label htmlFor="applyToAccount">
                            Aplicar a cuenta <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={applyToAccount}
                            onChange={(e: any) => setApplyToAccount(e.value)}
                            options={applyToAccounts}
                            id="applyToAccount"
                            optionLabel="name"
                            placeholder="Aplicar a cuenta"
                            className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'applyToAccount') ? 'p-invalid' : ''} `}
                        />{' '}
                    </div>

                    <div className="col-12 sm:col-6">
                        <label htmlFor="state">
                            Estado <span className="text-red-500">*</span>
                        </label>
                        <Dropdown
                            value={stateRol}
                            onChange={(e: any) => setStateRol(e.value)}
                            options={states}
                            id="state"
                            optionLabel="name"
                            placeholder="Estado"
                            className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'state') ? 'p-invalid' : ''} `}
                        />{' '}
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="description">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'description') ? 'p-invalid' : ''} `}
                        placeholder="Descripción"
                        rows={5}
                        cols={30}
                    />
                </div>

                <div>
                    <label htmlFor="category">Permisos</label>
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
