import { useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import stylesRevision from './Revision.module.css';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

const names = [
    { name: 'Juan Hernandez', code: 'CUSTOMER_ADMIN' },
    { name: 'Maria Cortez', code: 'CUSTOMER' }
];

const text = `<p>wdwad <span class="mention" data-index="0" data-denotation-char="@" data-id="1" data-value="variable_PH">﻿<span contenteditable="false">Partha</span>﻿</span>  <span style="color: rgb(230, 0, 0);"><span class="mention" data-index="1" data-denotation-char="@" data-id="2" data-value="date_contract">﻿<span contenteditable="false">Emma</span>﻿</span>   </span><span class="mention" data-index="1" data-denotation-char="@" data-id="2" data-value="date_contract">﻿<span contenteditable="false">Emma</span>﻿</span> </p><p><br></p><p><strong style="color: rgb(0, 0, 0);">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><br></p><p><strong style="color: rgb(0, 0, 0);">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><br></p><p><strong style="color: rgb(0, 0, 0);">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><br></p><p><strong style="color: rgb(0, 0, 0);">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><br></p><p><br></p><p><strong style="color: rgb(0, 0, 0);">Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p><p><br></p><p><strong style="color: rgb(0, 0, 0);"><span class="ql-cursor">﻿</span>Lorem Ipsum</strong><span style="color: rgb(0, 0, 0);">&nbsp;is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span></p>`;
export default function Revision() {
    const [name, setName] = useState<any>('');
    const [checked, setChecked] = useState(false);

    const handleExport = () => {};

    const handleSubmit = () => {};

    return (
        <section className="grid">
            <div className="col-12 md:col-4">
                <h3 className="m-0 mb-1 text-blue-500 font-bold cursor-pointer">Revisión</h3>

                <div>
                    <label htmlFor="name">Usuario asignado</label>
                    <Dropdown value={name} onChange={(e) => setName(e.value)} options={names} id="name" optionLabel="name" placeholder="Usuario responsable" className="w-full mt-2" />
                </div>

                <div className="flex justify-content-center mt-5">
                    <Button className="mr-3" label="Exportar" severity="danger" onClick={() => handleExport()} />
                    <Button label="Enviar" onClick={() => handleSubmit()} />
                </div>
            </div>
            <div className="col-12 md:col-8">
                <div className={`${stylesRevision['header-editor']}`}>
                    <div className="header-editor__description">
                        <h4 className="m-0">Conjunto Amatista</h4>
                        <h6 className="m-0 text-gray-500">Reglamento PH</h6>
                    </div>

                    {/*
                    <div className="header-editor__template">
                        <div className="flex align-content-center">
                            <h4 className="m-0 mr-3">CONVERTIR EN PLANTILLA</h4>
                            <Checkbox onChange={(e) => setChecked(e.checked)} checked={checked}></Checkbox>
                        </div>

                        <p className="header-editor__template--alert">Este documento será la base para la elaboración de otros documentos</p>
                    </div>
                   */}
                </div>
                <div className={`shadow-1 p-2 ${stylesRevision['editor']}`} dangerouslySetInnerHTML={{ __html: text }}></div>
            </div>
        </section>
    );
}
