import { showInfo } from './ToastMessages';

export const CopyToClipBoard = (data: string, toast: any) => {
    navigator.clipboard.writeText(data);
    showInfo(toast, '', 'ID copiado.');
};
