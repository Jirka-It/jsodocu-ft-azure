import { State } from '@enums/StateEnum';
import { Button } from 'primereact/button';

const TemplateInformationCard = ({ name, type, state, handleView, handleEdit, handleTemplateToDoc, handleDelete }) => {
    return (
        <div className="col-12 md:col-6 lg:col-4">
            <div className="shadow-2 p-4 m-2 surface-card border-round">
                <div className="relative mb-3">
                    <div className="absolute right-0 flex flex-column">
                        <Button onClick={() => handleEdit()} tooltip="Editar plantilla" className="mb-2" icon="pi pi-pencil" aria-label="Edit template" />
                        <Button onClick={() => handleTemplateToDoc()} tooltip="Usar como documento" className="mb-2" icon="pi pi-folder" severity="help" aria-label="Use how document" />
                        {state === State.ACTIVE ? (
                            <Button onClick={() => handleDelete()} tooltip="Desactivar plantilla" icon="pi pi-trash" severity="danger" aria-label="Inactive template" />
                        ) : (
                            <Button onClick={() => handleDelete()} tooltip="Activar plantilla" icon="pi pi-check-circle" severity="success" aria-label="Active template" />
                        )}
                    </div>
                    <img onClick={() => handleView()} src={'/demo/images/ecommerce/product-list/product-list-4-1.png'} className="w-full cursor-pointer" />
                </div>
                <div className="flex justify-content-between align-items-center mb-3">
                    <span className="text-900 font-medium text-xl">{name}</span>
                </div>
                <p className="mt-0 mb-3 text-700 line-height-3">{type}</p>
            </div>
        </div>
    );
};

export default TemplateInformationCard;
