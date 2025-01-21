import React, { useEffect, useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { VerifyErrorsInForms } from '@lib/VerifyErrorsInForms';
import { IZodError } from '@interfaces/IAuth';
import { IModalComment } from '@interfaces/IModal';
import { ValidationFlow } from '@lib/ValidationFlow';
import { showSuccess } from '@lib/ToastMessages';
import { CommentValidation } from '@validations/CommentValidation';

export default function CommentModal({ state, setState, toast, quill, setComment, comment, newRange, updateContent }: IModalComment) {
    const [description, setDescription] = useState<string>('');
    const [validations, setValidations] = useState<Array<IZodError>>([]);
    const [range, setRange] = useState<{ index: number; length: number }>();

    useEffect(() => {
        if (quill.current) {
            setRange(quill.current.unprivilegedEditor.getSelection());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (comment) {
            setDescription(comment);
        }
    }, [comment]);

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">{comment ? 'Resolver Comentario' : 'Agregar comentario'}</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Cancelar" severity="danger" onClick={() => handleClose()} />
            <Button label={`${comment ? 'Resolver' : 'Guardar'}`} onClick={() => handleSubmit()} />
        </div>
    );

    const handleSubmit = async () => {
        if (!comment) {
            //Validate data
            const validationFlow = ValidationFlow(
                CommentValidation({
                    description
                }),
                toast
            );

            // Show errors in inputs
            setValidations(validationFlow);
            if (validationFlow && validationFlow.length > 0) {
                return;
            }

            //Add comment
            quill.current.editor.formatText(range.index, range.length, 'customTag', description);
            showSuccess(toast, '', 'Comentario agregado');
        } else {
            //New range is when I want to delete one comment
            showSuccess(toast, '', 'Comentario eliminado');
            quill.current.editor.formatText(newRange.index, newRange.length, 'customTag', false);
            updateContent();
        }

        handleClose();
    };

    const handleClose = async () => {
        setComment(null);
        setDescription('');
        setState(!state);
    };

    // Inputs events

    return (
        <Dialog
            visible={state}
            modal
            header={headerElement}
            footer={footerContent}
            closable={false}
            style={{ width: '30rem' }}
            onHide={() => {
                if (!state) return;
                setState(false);
            }}
        >
            <div className="flex flex-column gap-4">
                <div className="w-full">
                    <label htmlFor="description">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <InputTextarea
                        autoResize
                        disabled={comment ? true : false}
                        autoFocus={true}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="description"
                        className={`w-full mt-2 ${VerifyErrorsInForms(validations, 'description') ? 'p-invalid' : ''} `}
                        placeholder="Descripción"
                        rows={5}
                        cols={30}
                    />
                </div>
            </div>
        </Dialog>
    );
}
