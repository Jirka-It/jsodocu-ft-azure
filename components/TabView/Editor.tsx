import { Editor as Quill } from 'primereact/editor';
import { useState } from 'react';

export default function Editor() {
    const [text, setText] = useState('');
    return (
        <section className="grid">
            <div className="col-12 md:col-6">
                {' '}
                <Quill value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
            </div>
            <div className="col-12 md:col-6">
                <div dangerouslySetInnerHTML={{ __html: text }}></div>
            </div>
        </section>
    );
}
