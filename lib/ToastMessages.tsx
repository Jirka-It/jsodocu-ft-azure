export const showSuccess = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'success', summary, detail, life: time });
};

export const showInfo = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'info', summary, detail, life: time });
};

export const showWarn = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'warn', summary, detail, life: time });
};

export const showError = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'error', summary, detail, life: time });
};

export const showSecondary = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'secondary', summary, detail, life: time });
};

export const showContrast = (toast: any, summary: string, detail: string, time: number = 1500) => {
    toast.current.show({ severity: 'contrast', summary, detail, life: time });
};
