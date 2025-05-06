import { IBasicAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

export default function BasicActions({ handleEdit, handleDelete }: IBasicAction) {
    return (
        <div className="flex">
            <Button onClick={() => handleEdit()} icon="pi pi-pencil" className="mr-2" tooltip="Editar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Borrar" />
        </div>
    );
}
