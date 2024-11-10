import { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import stylesRevision from './Revision.module.css';

export default function Revision() {
    const [checked, setChecked] = useState(false);

    return (
        <section className="grid">
            <div className="col-12 sm:col-4"></div>
            <div className="col-12 sm:col-8">
                {
                    // flex justify-content-between
                }
                <div className={`${stylesRevision['header-editor']}`}>
                    <div className="header-editor__description">
                        <h4 className="m-0">Conjunto Amatista</h4>
                        <h6 className="m-0 text-gray-500">Reglamento PH</h6>
                    </div>

                    <div className="header-editor__template">
                        <div className="flex align-content-center">
                            <h4 className="m-0 mr-3">CONVERTIR EN PLANTILLA</h4>
                            <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                        </div>

                        <p className="header-editor__template--alert">Este documento será la base para la elaboración de otros documentos</p>
                    </div>
                </div>
                <div className={`shadow-1 p-2 ${stylesRevision['editor']}`} dangerouslySetInnerHTML={{ __html: '<p>hola</p>' }}></div>
            </div>
        </section>
    );
}
