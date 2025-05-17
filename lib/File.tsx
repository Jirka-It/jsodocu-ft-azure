const { format } = require('date-fns');

import { IFileTable } from '@interfaces/IFile';

export const newFile = (name: string, file: any) => {
    const ext = file.name.split('.').pop();
    return new File([file], `${name}.${ext}`, {
        type: file.type
    });
};

export const parsingFile = (filePath: string, name: string): IFileTable => {
    //Separate date and name
    const separatedInf = filePath.split('/').pop();
    const inf = separatedInf.split('-');

    const date = format(new Date(parseInt(inf[0])), 'dd/MM/yyyy');
    //Extension
    const ext = name.split('.').pop();

    const newFile = {
        name,
        date,
        ext,
        filePath
    };

    return newFile;
};

export const iconFile = (ext: string, name: string) => {
    if (ext === 'doc' || ext === 'docx') {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-file-word mr-2 text-blue-600" style={{ fontSize: '2rem' }}></i> {name}
            </div>
        );
    } else if (ext === 'xls' || ext === 'xlsx') {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-file-excel mr-2 text-green-600" style={{ fontSize: '2rem' }}></i> {name}
            </div>
        );
    } else if (ext === 'pdf') {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-file-pdf mr-2 text-red-600" style={{ fontSize: '2rem' }}></i> {name}
            </div>
        );
    } else if (ext === 'txt') {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-align-justify mr-2" style={{ fontSize: '2rem' }}></i> {name}
            </div>
        );
    } else {
        return (
            <div className="flex align-items-center">
                <i className="pi pi-image mr-2 text-cyan-500" style={{ fontSize: '2rem' }}></i> {name}
            </div>
        );
    }
};
