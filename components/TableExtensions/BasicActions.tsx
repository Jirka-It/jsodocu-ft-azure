import { Button } from 'primereact/button';

interface IBasicActions {
    handleEdit: Function;
    handleDelete: Function;
}

export default function BasicActions({ handleEdit, handleDelete }: IBasicActions) {
    return (
        <div>
            <Button onClick={() => handleEdit()} icon="pi pi-pencil" className="mr-2" tooltip="Editar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Borrar" />
        </div>
    );
}
