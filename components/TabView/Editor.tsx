import { Editor as Quill } from 'primereact/editor';
import Mention from 'quill-mention';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const data = [
    { id: 1, chatter: 'variable_PH', variable: 'Partha' },

    { id: 2, chatter: 'date_contract', variable: 'Emma' }
];

export default function Editor() {
    const [sections, setSections] = useState([]);
    const [contentSelected, setContentSelected] = useState<number>();

    const quillLoaded = (event) => {
        const quillInstance = event;

        new Mention(quillInstance, {
            mentionDenotationChars: ['@'],
            source: function (searchTerm: string, renderList: (data: any, searchText: string) => void, mentionChar: string) {
                // sample data set for displaying
                // enter your logic here

                renderList(data, searchTerm);
            }
        });
    };

    //Move it to utils
    const replaceText = (text: string) => {
        if (!text) {
            return '';
        }
        let newString = text;

        //Find by mentions
        for (var i = 0; i < data.length; i++) {
            const chatter = data[i].chatter;
            const regex = new RegExp(`@${chatter}`, 'g');

            newString = newString.replaceAll(regex, data[i].variable);
        }

        return newString;
    };

    //Events to quill
    const handleInputChange = (id: string, value: any, key = 'chatter') => {
        setSections((prevArray) => {
            const modifiedSections = prevArray.map((v) => {
                if (v.id === id) {
                    v[key] = value;
                }
                return v;
            });
            return [...modifiedSections];
        });
    };

    const handleClickEvent = (id: string) => {
        setContentSelected(parseInt(id));
    };

    const handleChangeEvent = (value: string, content) => {
        handleInputChange(content.id, value, 'content');
    };

    // Add chapter
    const addChapter = () => {
        setSections((prevArray) => [
            ...prevArray,
            {
                id: sections.length + 1,
                label: `Capítulo ${sections.length + 1}`,
                chatter: '',
                content: ''
            }
        ]);

        setContentSelected(sections.length + 1);
    };

    return (
        <section className="grid">
            <div className="col-12 lg:col-4">
                <h4 className="m-0">Conjunto Amatista</h4>
                <h6 className="m-0 text-gray-500 mb-5">Reglamento PH</h6>
                <div>
                    {sections.map((s) => {
                        return (
                            <div key={s.id}>
                                <h5 className="m-0 mb-1 text-blue-500 font-bold cursor-pointer" onClick={() => handleClickEvent(s.id)}>
                                    Capítulo {s.id}.
                                </h5>
                                <div className="flex">
                                    <InputText value={s.chatter} onChange={(e) => handleInputChange(s.id, e.target.value)} className="w-full mb-3" type="text" placeholder="Nombre del capítulo" />
                                    <Button icon="pi pi-save" rounded severity="info" aria-label="Delete" className="ml-2" tooltip="Guardar" />
                                    <Button icon="pi pi-times" rounded severity="danger" aria-label="Delete" className="ml-2" tooltip="Borrar" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 cursor-pointer text-blue-500" onClick={() => addChapter()}>
                    <i className="pi pi-plus-circle mr-3"></i> Agregar Capítulo
                </div>
            </div>
            {sections.map((s) => {
                return (
                    <div key={s.id} className={`grid col-12 lg:col-8 ${s.id !== contentSelected ? 'hidden' : ''}`}>
                        <div className="col-12 lg:col-6">
                            <Quill value={s.content} onTextChange={(e) => handleChangeEvent(e.htmlValue, s)} style={{ height: '320px' }} onLoad={quillLoaded} />
                        </div>
                        <div className="col-12 lg:col-6">
                            <div className="shadow-1 h-full pl-2 pr-2" dangerouslySetInnerHTML={{ __html: replaceText(s.content) }}></div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
