export const replaceText = (text: string, data: Array<any>) => {
    if (!text) {
        return '';
    }
    let newString = text;

    //Find by mentions
    for (var i = 0; i < data.length; i++) {
        const chatter = data[i].value;
        const regex = new RegExp(`@${chatter}`, 'g');

        newString = newString.replaceAll(regex, data[i].variable);
    }

    return newString;
};
