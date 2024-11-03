import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { IVariableModal } from '@interfaces/IModal';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { Toast } from 'primereact/toast';
import { ValidationFlow } from '@lib/ValidationFlow';
import { VariableValidation } from '@validations/VariableValidation';
import { Dropdown } from 'primereact/dropdown';
import { Variable } from '@enums/DocumentEnum';

const names = [
    { name: 'Tipo entidad aprobadora de licencia', code: 'CUSTOMER_ADMIN' },
    { name: 'Tipo entidad receptora servidumbre', code: 'CUSTOMER' }
];

const categories = [
    { name: 'General', code: Variable.GENERAL },
    { name: 'Proyecto', code: Variable.PROJECT }
];

export default function VariableModal({ state, setState, addData }: IVariableModal) {
    const toast = useRef(null);
    const [name, setName] = useState<any>('');
    const [category, setCategory] = useState<any>('');

    const [validations, setValidations] = useState<Array<IZodError>>([]);

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
        //Validate data
        const validationFlow = ValidationFlow(
            VariableValidation({
                name: name.code,
                category: category.code
            }),
            toast
        );

        // Show errors in inputs
        setValidations(validationFlow);
        if (validationFlow && validationFlow.length > 0) {
            return;
        }

        addData({
            name: name.name,
            category: category.code
        });
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setCategory('');
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
                    <Dropdown
                        value={name}
                        onChange={(e) => setName(e.value)}
                        options={names}
                        id="name"
                        optionLabel="name"
                        placeholder="Nombre de la variable"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'name') ? 'p-invalid' : ''} `}
                    />
                </div>

                <div>
                    <label htmlFor="category">
                        Categoría de la variable <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        value={category}
                        onChange={(e) => setCategory(e.value)}
                        options={categories}
                        id="category"
                        optionLabel="name"
                        placeholder="Categoría de la variable"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'category') ? 'p-invalid' : ''} `}
                    />
                </div>
            </div>
        </Dialog>
    );
}
