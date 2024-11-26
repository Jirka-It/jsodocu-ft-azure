import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';

import VariableModal from '@components/Modals/VariableModal';
import BasicStates from '@components/TableExtensions/BasicStates';
import { VariableType } from '@enums/DocumentEnum';
import VariableActions from '@components/TableExtensions/VariableActions';
import { IVariable } from '@interfaces/IVariable';
import { findAll, update, remove } from '@api/variables';
import { HttpStatus } from '@enums/HttpStatusEnum';
import { CopyToClipBoard } from '@lib/CopyToClipBoard';
import { departments } from '@lib/data';
import { showError, showSuccess } from '@lib/ToastMessages';

const types = [
    { name: 'Texto', value: VariableType.TEXT },
    { name: 'Número', value: VariableType.NUMBER },
    { name: 'Fecha', value: VariableType.DATE },
    { name: 'Municipalidades', value: VariableType.MUNICIPALITIES }
];

export default function VariableList() {
    const toast = useRef(null);
    const params = useParams();
    const [variables, setVariables] = useState<Array<IVariable>>([]);
    const [municipalities, setMunicipalities] = useState<Array<string>>();

    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        getData();
        const newArray = [];
        departments.map((d) => {
            d.cities.map((c) => {
                newArray.push(`${c} - ${d.department}`);
            });
        });
        setMunicipalities(newArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = async (page: number = 1, size: number = 999) => {
        const res = await findAll({ page, size, documentId: params.id });
        setVariables(res.data);
    };

    const addVariable = () => {
        getData();
    };

    const variableValue = (variable) => {
        switch (variable.type) {
            case VariableType.TEXT:
                return <InputText value={variable.value} onChange={(e) => handleInputChange(variable._id, e.target.value, 'value')} id="value" className="w-15rem" type="text" placeholder="Valor de la variable" />;

            case VariableType.NUMBER:
                return <InputNumber value={variable.value} onValueChange={(e) => handleInputChange(variable._id, e.target.value, 'value')} id="number" className="w-15rem" placeholder="Valor de la variable" useGrouping={false} />;

            case VariableType.DATE:
                return <Calendar value={new Date(variable.value)} onChange={(e) => handleInputChange(variable._id, e.target.value, 'value')} id="date" className="w-15rem" placeholder="Valor de la variable" />;

            case VariableType.MUNICIPALITIES:
                return <Dropdown filter value={variable.value} onChange={(e) => handleInputChange(variable._id, e.target.value, 'value')} options={municipalities} id="municipalities" placeholder="Categoría de la variable" className="w-15rem" />;

            default:
                return <InputText value={variable.value} onChange={(e) => handleInputChange(variable._id, e.target.value, 'value')} id="value" type="text" className="w-15rem" placeholder="Valor de la variable" />;
        }
    };

    const typeValue = (variable) => {
        return (
            <div>
                <Dropdown value={variable.type} optionLabel="name" optionValue="value" onChange={(e) => handleInputChange(variable._id, e.target.value, 'type')} options={types} id="type" placeholder="Tipo de la variable" className="w-15rem" />
            </div>
        );
    };

    const handleInputChange = (id: string, value: string | number, key: string) => {
        const modifiedVariables = variables.map((v: IVariable) => {
            if (v._id === id) {
                v[key] = value;
                if (key === 'type') {
                    v['value'] = '';
                }
            }
            return v;
        });

        setVariables(modifiedVariables);
    };

    // Table actions
    const handleCopy = (data: string) => {
        CopyToClipBoard(data, toast);
    };

    const handleDelete = async (id: string) => {
        const res = await remove(id);
        if (res.status === HttpStatus.OK) {
            const modifiedVariables = variables.filter((v) => v._id !== id);
            setVariables(modifiedVariables);
            showSuccess(toast, '', 'Variable eliminada');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    const handleEdit = async (data: IVariable) => {
        const res = await update(data._id, {
            value: data.value,
            type: data.type
        });

        if (res.status === HttpStatus.OK) {
            showSuccess(toast, '', 'Variable actualizada');
            //getData();
        } else if (res.status === HttpStatus.BAD_REQUEST) {
            showError(toast, '', 'Revise los datos ingresados');
        } else {
            showError(toast, '', 'Contacte con soporte.');
        }
    };

    return (
        <section>
            <Toast ref={toast} />
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Variable" />
            <VariableModal state={openModal} setState={(e) => setOpenModal(e)} addData={() => addVariable()} />
            <DataTable value={variables} emptyMessage=" ">
                <Column field="_id" header="ID" body={(rowData: IVariable) => <Tag onClick={() => handleCopy(rowData._id)} className="cursor-pointer text-lg" value={`${rowData._id.substr(-4)}`}></Tag>}></Column>
                <Column field="name" header="Nombre"></Column>
                <Column field="value" header="Valor" body={variableValue}></Column>
                <Column field="category.name" header="Categoría" body={(rowData) => <BasicStates state={rowData.category.name} />}></Column>
                <Column field="type" header="Tipo" body={typeValue}></Column>
                <Column field="actions" header="Acciones" body={(rowData: IVariable) => <VariableActions handleEdit={() => handleEdit(rowData)} handleDelete={() => handleDelete(rowData._id)} />}></Column>
            </DataTable>
        </section>
    );
}
