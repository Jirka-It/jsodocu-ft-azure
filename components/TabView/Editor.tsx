import { Editor as Quill } from 'primereact/editor';
import Mention from 'quill-mention';
import { Tree } from 'primereact/tree';

import { useRef, useState } from 'react';

const data = [
    { id: 1, value: 'variable_PH', variable: 'Partha' },
    { id: 2, value: 'date_contract', variable: 'Emma' }
];

const dataTree = [
    {
        key: '1',
        label: 'Capítulo 1'
    },
    {
        key: '2',
        label: 'Capítulo 2'
    },
    {
        key: '3',
        label: 'Capítulo 3'
    }
];

export default function Editor() {
    const [text, setText] = useState('');
    const quillRef = useRef<Quill | null>(null);
    const [nodes, setNodes] = useState(dataTree);

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
            const value = data[i].value;
            const regex = new RegExp(`@${value}`, 'g');

            newString = newString.replaceAll(regex, data[i].variable);
        }

        return newString;
    };

    return (
        <section className="grid">
            <div className="col-12 lg:col-2">
                <h4 className="m-0">Conjunto Amatista</h4>
                <h6 className="m-0 text-gray-500">Reglamento PH</h6>

                <div className="mt-8 cursor-pointer text-blue-500">
                    <i className="pi pi-plus-circle mr-3"></i> Agregar Capítulo
                </div>
            </div>
            <div className="col-12 lg:col-5">
                <Quill ref={quillRef} value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} onLoad={quillLoaded} />
            </div>
            <div className="col-12 lg:col-5">
                <div className="shadow-1 h-full pl-2 pr-2" dangerouslySetInnerHTML={{ __html: replaceText(text) }}></div>
            </div>
        </section>
    );
}
