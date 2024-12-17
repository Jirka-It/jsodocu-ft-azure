import React from 'react';

import { Quill } from 'react-quill';

// const BorderButton = () => <FaRegSquare />;
const CommentButton = () => <i className="pi pi-comment"></i>;

function addDivider() {
    const range = this.quill.getSelection(true);
    this.quill.insertText(range.index, '\n', Quill.sources.USER);
    this.quill.insertEmbed(range.index + 1, 'divider', true, Quill.sources.USER);
    this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
}

const Inline = Quill.import('blots/inline');
class EmphBlot extends Inline {}
EmphBlot.blotName = 'em';
EmphBlot.tagName = 'em';
EmphBlot.className = 'custom-em';
Quill.register('formats/em', EmphBlot);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
Quill.register(Font, true);

// Formats objects for setting up the Quill editor
export const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'align', 'strike', 'script', 'blockquote', 'background', 'list', 'bullet', 'indent', 'link', 'image', 'color', 'em', 'p', 'divider', 'hr', 'formats/em'];

// Quill Toolbar component
export const QuillToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <select className="ql-header" defaultValue="6">
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
                <option value="4">Heading 4</option>
                <option value="5">Heading 5</option>
                <option value="6">Heading 6</option>
                <option value="">Normal</option>
            </select>
        </span>
        <span className="ql-formats">
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
        </span>

        <span className="ql-formats">
            <button className="ql-blockquote" />
            <button className="ql-comment">
                <CommentButton />
            </button>
        </span>
        <span className="ql-formats">
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            <button className="ql-indent" value="-1" />
            <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
        </span>
    </div>
);

export default QuillToolbar;
