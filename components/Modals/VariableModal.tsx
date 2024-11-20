import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

import { IVariableModal } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { ValidationFlow } from '@lib/ValidationFlow';
import { VariableValidation } from '@validations/VariableValidation';
import { VariableType } from '@enums/DocumentEnum';
import { State } from '@enums/StateEnum';

import { create, findByName } from '@api/variables';
import { findAll } from '@api/categories';
import { ICategoryResponse } from '@interfaces/ICategory';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { showError, showInfo, showSuccess, showWarn } from '@lib/ToastMessages';
import { CleanText } from '@lib/CleanText';

export default function VariableModal({ state, setState, addData }: IVariableModal) {
    const params = useParams();
    const toast = useRef(null);
    const [timer, setTimer] = useState(null);
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<any>('');
    const [isUnique, setIsUnique] = useState<boolean>(true);
    const [categories, setCategories] = useState<ICategoryResponse>();
    const [validations, setValidations] = useState<Array<IZodError>>([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async (page: number = 1, size: number = 100) => {
        const res = await findAll({ page, size });
        setCategories(res);
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Variable</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label="Agregar" onClick={() => handleSubmit()} />
        </div>
    );

    const handleSubmit = async () => {
        if (!isUnique) {
            showWarn(toast, '', 'Ya existe una variable con este nombre');
            return;
        }
        //Validate data
        const validationFlow = ValidationFlow(
            VariableValidation({
                name: name,
                category: category
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        const res = await create({
            name,
            value: '',
            category,
            document: params.id,
            type: VariableType.TEXT,
            state: State.ACTIVE
        });

        if (res.status === HttpStatus.OK || res.status === HttpStatus.CREATED) {
            showSuccess(toast, '', 'Variable creada');
            setTimeout(() => {
                addData();
                handleClose();
            }, 500);
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte');
        }
    };

    const handleClose = () => {
        setName('');
        setCategory('');
        setValidations([]);
        setState(!state);
        setIsUnique(true);
    };

    // Inputs events
    const handleChange = async (name: string) => {
        const newName = CleanText(name);
        setName(newName);
        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await findByName(params.id, newName);
                if (!res) {
                    showWarn(toast, '', 'Ya existe una variable con este nombre');
                    setIsUnique(false);
                } else {
                    showInfo(toast, '', 'Nombre disponible');
                    setIsUnique(true);
                }
            } catch (error) {
                showError(toast, '', 'Contacte con soporte');
                setIsUnique(true);
            }
        }, 1000);

        setTimer(newTimer);
    };

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <Toast ref={toast} />

            <div className="flex flex-column gap-4">
                <div>
                    <label htmlFor="name">
                        Nombre de la variable <span className="text-red-500">*</span>
                    </label>

                    <InputText value={name} onChange={(e) => handleChange(e.target.value)} id="name" type="text" className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `} placeholder="Nombre de la variable" />
                </div>

                <div>
                    <label htmlFor="category">
                        Categoría de la variable <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={category}
                        onChange={(e) => setCategory(e.value)}
                        options={categories?.data}
                        id="category"
                        optionLabel="name"
                        optionValue="_id"
                        placeholder="Categoría de la variable"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'category') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
