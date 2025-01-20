export interface IFile {
    message?: string;
    filePath?: string;
    code?: number;
    status?: number;
}

export interface IFileResponse {
    code?: number;
    status?: number;
}

export interface IFileTable {
    name: string;
    date: string;
    filePath: string;
    ext: string;
}
