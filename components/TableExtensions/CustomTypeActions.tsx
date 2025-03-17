import { State } from '@enums/StateEnum';
import { ICustomAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

//<Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />
export default function CustomTypeActions({ handleEdit, handleDelete, data, children }: ICustomAction) {
    return (
        <div className="flex">
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />
            {data === State.PENDING ? (
                <>
                    <Button onClick={() => handleDelete(State.ACTIVE)} icon="pi pi-check-circle" className="mr-2" severity="success" tooltip="Activar" />
                    <Button onClick={() => handleDelete(State.INACTIVE)} icon="pi pi-trash" severity="danger" tooltip="Desactivar" />
                </>
            ) : data === State.ACTIVE ? (
                <Button onClick={() => handleDelete(State.INACTIVE)} icon="pi pi-trash" severity="danger" tooltip="Desactivar" />
            ) : (
                <Button onClick={() => handleDelete(State.ACTIVE)} icon="pi pi-check-circle" severity="success" tooltip="Activar" />
            )}

            {children}
        </div>
    );
}
