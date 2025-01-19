export const newFile = (name: string, file: any) => {
    const ext = file.name.split('.').pop();
    return new File([file], `${name}.${ext}`, {
        type: file.type
    });
};
