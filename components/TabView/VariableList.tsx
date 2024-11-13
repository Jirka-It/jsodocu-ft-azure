import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState } from 'react';
import { Button } from 'primereact/button';
import VariableModal from '@components/Modals/VariableModal';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import BasicStates from '@components/TableExtensions/BasicStates';
import { VariableType } from '@enums/DocumentEnum';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';

const types = [VariableType.TEXT, VariableType.NUMBER, VariableType.DATE, VariableType.MUNICIPALITIES];

const municipalities = [
    { name: 'Medellín', code: 'MEDELLIN' },
    { name: 'Barranquilla', code: 'BARRANQUILLA' }
];

export default function VariableList() {
    const [variables, setVariables] = useState<Array<any>>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);

    const addVariable = (e) => {
        setVariables((prevArray) => [...prevArray, { ...e, id: prevArray.length + 1, value: '', type: '' }]);
    };

    const variableValue = (variable) => {
        switch (variable.type) {
            case VariableType.TEXT:
                return <InputText value={variable.value} onChange={(e) => handleInputChange(variable.id, e.target.value, 'value')} id="value" className="w-15rem" type="text" placeholder="Valor de la variable" />;

            case VariableType.NUMBER:
                return <InputNumber value={variable.value} onValueChange={(e) => handleInputChange(variable.id, e.target.value, 'value')} id="number" className="w-15rem" placeholder="Valor de la variable" useGrouping={false} />;

            case VariableType.DATE:
                return <Calendar value={variable.value} onChange={(e) => handleInputChange(variable.id, e.target.value, 'value')} id="date" className="w-15rem" placeholder="Valor de la variable" />;

            case VariableType.MUNICIPALITIES:
                return (
                    <Dropdown
                        value={variable.value}
                        onChange={(e) => handleInputChange(variable.id, e.target.value, 'value')}
                        options={municipalities}
                        id="municipalities"
                        optionLabel="name"
                        placeholder="Categoría de la variable"
                        className="w-15rem"
                    />
                );

            default:
                return <InputText value={variable.value} onChange={(e) => handleInputChange(variable.id, e.target.value, 'value')} id="value" type="text" className="w-15rem" placeholder="Valor de la variable" />;
        }
    };

    const typeValue = (variable) => {
        return (
            <div>
                <Dropdown value={variable.type} onChange={(e) => handleInputChange(variable.id, e.target.value, 'type')} options={types} id="type" placeholder="Tipo de la variable" className="w-15rem" />
                <Button icon="pi pi-times" rounded severity="danger" aria-label="Delete" className="ml-2" tooltip="Borrar" onClick={() => handleDeleteChange(variable.id)} />
            </div>
        );
    };

    const handleInputChange = (id: string, value: string | number, key: string) => {
        const modifiedVariables = variables.map((v) => {
            if (v.id === id) {
                v[key] = value;
                if (key === 'type') {
                    v['value'] = '';
                }
            }
            return v;
        });

        setVariables(modifiedVariables);
    };

    const handleDeleteChange = (id: string) => {
        const modifiedVariables = variables.filter((v) => v.id !== id);
        setVariables(modifiedVariables);
    };
    return (
        <section>
            <Button onClick={() => setOpenModal(true)} icon="pi pi-plus" className="mr-2 mb-3" label="Variable" />
            <VariableModal state={openModal} setState={(e) => setOpenModal(e)} addData={(e) => addVariable(e)} />

            <DataTable value={variables} emptyMessage=" ">
                <Column field="id" header="ID"></Column>
                <Column field="name" header="Nombre"></Column>
                <Column field="value" header="Valor" body={variableValue}></Column>
                <Column field="category" header="Categoría" body={(rowData) => <BasicStates state={rowData.category} />}></Column>
                <Column field="type" header="Tipo" body={typeValue}></Column>
            </DataTable>
        </section>
    );
}
