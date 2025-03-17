import { IDocumentAction } from '@interfaces/IBasicAction';
import { Button } from 'primereact/button';

export default function DocumentActions({ handleView, handleEdit, handleDelete, children }: IDocumentAction) {
    return (
        <div className="flex">
            <Button onClick={() => handleView()} icon="pi pi-file-import" className="mr-2" tooltip="Revisar" />
            <Button onClick={() => handleEdit()} icon="pi pi-file-edit" className="mr-2" tooltip="Editar" />
            <Button onClick={() => handleDelete()} icon="pi pi-trash" severity="danger" tooltip="Eliminar" />

            {children}
        </div>
    );
}
