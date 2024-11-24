export const replaceText = (text: string, data: Array<any>) => {
    if (!text || !data) {
        return '';
    }
    let newString = text;

    //Find by mentions
    for (var i = 0; i < data.length; i++) {
        const valueMention = data[i].value;
        const regex = new RegExp(`@${valueMention}`, 'g');

        newString = newString.replaceAll(regex, data[i].name);
    }

    return newString;
};
