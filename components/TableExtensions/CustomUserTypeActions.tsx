import { State } from '@enums/StateEnum';
import { ICustomUserAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

//<Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />
export default function CustomUserTypeActions({ handleEdit, handleDelete, handleEditPassword, data }: ICustomUserAction) {
    return (
        <div className="flex">
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />

            <Button onClick={() => handleEditPassword()} icon="pi pi-key" severity="warning" className="mr-2" tooltip="Clave" />

            {data === State.ACTIVE ? <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Desactivar" /> : <Button onClick={() => handleDelete()} icon="pi pi-check-circle" severity="success" tooltip="Activar" />}
        </div>
    );
}
