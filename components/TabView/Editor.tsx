import { Editor as Quill } from 'primereact/editor';
import Mention from 'quill-mention';

import { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const data = [
    { id: 1, chatter: 'variable_PH', variable: 'Partha' },
    { id: 2, chatter: 'date_contract', variable: 'Emma' }
];

const dataTree = [
    {
        id: '1',
        label: 'Capítulo 1',
        chatter: 'www',
        content: 'wdwdwdwd'
    },
    {
        id: '2',
        label: 'Capítulo 2',
        chatter: '',
        content: ''
    },
    {
        id: '3',
        label: 'Capítulo 3',
        chatter: '',
        content: ''
    }
];

export default function Editor() {
    const [nodes, setNodes] = useState(dataTree);
    const [contentSelected, setContentSelected] = useState<string>('1');

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

    const handleInputChange = (id: string, value: any, key = 'chatter') => {
        const modifiedNodes = nodes.map((v) => {
            if (v.id === id) {
                v[key] = value;
            }
            return v;
        });

        setNodes(modifiedNodes);
    };

    const handleClickEvent = (id: string) => {
        setContentSelected(id);
    };

    const handleChangeEvent = (value: string, content) => {
        handleInputChange(content.id, value, 'content');
    };

    return (
        <section className="grid">
            <div className="col-12 lg:col-4">
                <h4 className="m-0">Conjunto Amatista</h4>
                <h6 className="m-0 text-gray-500 mb-5">Reglamento PH</h6>
                <div>
                    {' '}
                    {nodes.map((d, i) => {
                        return (
                            <div key={`${i}`}>
                                <h5 className="m-0 mb-1 text-blue-500 font-bold cursor-pointer" onClick={() => handleClickEvent(d.id)}>
                                    Capítulo {i + 1}.
                                </h5>
                                <div className="flex">
                                    <InputText value={d.chatter} onChange={(e) => handleInputChange(d.id, e.target.value)} className="w-full mb-3" type="text" placeholder="Nombre del capítulo" />
                                    <Button icon="pi pi-save" rounded severity="info" aria-label="Delete" className="ml-2" tooltip="Guardar" />
                                    <Button icon="pi pi-times" rounded severity="danger" aria-label="Delete" className="ml-2" tooltip="Borrar" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 cursor-pointer text-blue-500">
                    <i className="pi pi-plus-circle mr-3"></i> Agregar Capítulo
                </div>
            </div>
            {nodes.map((d, i) => {
                return (
                    <div key={i} className={`grid col-12 lg:col-8 ${d.id !== contentSelected ? 'hidden' : ''}`}>
                        <div className="col-12 lg:col-6">
                            <Quill value={d.content} onTextChange={(e) => handleChangeEvent(e.htmlValue, d)} style={{ height: '320px' }} onLoad={quillLoaded} />
                        </div>
                        <div className="col-12 lg:col-6">
                            <div className="shadow-1 h-full pl-2 pr-2" dangerouslySetInnerHTML={{ __html: replaceText(d.content) }}></div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
