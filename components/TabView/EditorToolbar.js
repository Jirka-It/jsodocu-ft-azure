import React from 'react';

import { Quill } from 'react-quill';
import 'quill-mention';

// const BorderButton = () => <FaRegSquare />;
const CommentButton = () => <i className="pi pi-comment"></i>;

const Inline = Quill.import('blots/inline');

class CustomSpan extends Inline {
    static create(value) {
        const node = super.create();
        node.setAttribute('data-tooltip', value);
        return node;
    }

    static formats(node) {
        return node.getAttribute('data-tooltip');
    }
}

CustomSpan.blotName = 'customTag';
CustomSpan.tagName = 'comment';
Quill.register(CustomSpan);

// Formats objects for setting up the Quill editor
export const formats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'align', 'strike', 'script', 'blockquote', 'background', 'list', 'bullet', 'indent', 'link', 'image', 'color', 'em', 'p', 'divider', 'hr', 'customTag', 'mention'];

// Quill Toolbar component
export const QuillToolbar = ({ inReview }) => (
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

            {inReview ? (
                <button className="ql-comment">
                    <CommentButton />
                </button>
            ) : (
                ''
            )}
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
