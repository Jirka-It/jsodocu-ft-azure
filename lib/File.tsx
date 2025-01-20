const { format } = require('date-fns');

import { IFileTable } from '@interfaces/IFile';

export const newFile = (name: string, file: any) => {
    const ext = file.name.split('.').pop();
    return new File([file], `${name}.${ext}`, {
        type: file.type
    });
};

export const parsingFile = (filePath: string): IFileTable => {
    //Separate date and name
    const separatedInf = filePath.split('/');
    const inf = separatedInf[1].split('-');

    const date = format(new Date(parseInt(inf[0])), 'dd/MM/yyyy');
    const name = inf[1];
    //Extension
    const ext = filePath.split('.').pop();

    const newFile = {
        name,
        date,
        ext,
        filePath
    };

    return newFile;
};
