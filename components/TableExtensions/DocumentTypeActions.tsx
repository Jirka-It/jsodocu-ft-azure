import { State } from '@enums/StateEnum';
import { ICustomAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

//<Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />
export default function DocumentTypeActions({ handleEdit, handleDelete, data }: ICustomAction) {
    return (
        <div>
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />

            {data === State.ACTIVE ? <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Desactivar" /> : <Button onClick={() => handleDelete()} icon="pi pi-check-circle" severity="success" tooltip="Activar" />}
        </div>
    );
}
