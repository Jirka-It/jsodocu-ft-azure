import { IBasicAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

export default function DocumentTypeActions({ handleEdit, handleDelete }: IBasicAction) {
    return (
        <div>
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />
        </div>
    );
}
