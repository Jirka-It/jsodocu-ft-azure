import { IBasicAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

export default function DocumentActions({ handleEdit, handleDelete }: IBasicAction) {
    return (
        <div>
            <Button icon="pi pi-file-import" className="mr-2" tooltip="Revisar" />
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Borrar" />
        </div>
    );
}
