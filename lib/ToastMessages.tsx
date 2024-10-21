export const showSuccess = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'success', summary, detail, life: 3000 });
};

export const showInfo = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'info', summary, detail, life: 3000 });
};

export const showWarn = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'warn', summary, detail, life: 3000 });
};

export const showError = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'error', summary, detail, life: 3000 });
};

export const showSecondary = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'secondary', summary, detail, life: 3000 });
};

export const showContrast = (toast: any, summary: string, detail: string) => {
    toast.current.show({ severity: 'contrast', summary, detail, life: 3000 });
};
