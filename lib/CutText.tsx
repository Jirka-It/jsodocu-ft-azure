export const CutText = (text: string) => {
    if (text) {
        if (text.length > 30) {
            return text.slice(0, 30) + '...';
        }

        return text;
    }
};
