import { Editor as Quill } from 'primereact/editor';
import Mention from 'quill-mention';

import { useEffect, useRef, useState } from 'react';

const data = [
    { id: 1, value: 'variable_PH', variable: 'Partha' },
    { id: 2, value: 'date_contract', variable: 'Emma' }
];

export default function Editor() {
    const [text, setText] = useState('');
    const quillRef = useRef<Quill | null>(null);
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
            <div className="col-12 md:col-6">
                <Quill ref={quillRef} value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} onLoad={quillLoaded} />
            </div>
            <div className="col-12 md:col-6">
                <div dangerouslySetInnerHTML={{ __html: replaceText(text) }}></div>
            </div>
        </section>
    );
}
