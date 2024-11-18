import { IBasicAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

export default function VariableActions({ handleEdit, handleDelete }: IBasicAction) {
    return (
        <div>
            <Button onClick={() => handleEdit()} icon="pi pi-save" className="mr-2" tooltip="Actualizar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />
        </div>
    );
}
