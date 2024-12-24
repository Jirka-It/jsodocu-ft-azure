import { IVariableLight } from '@interfaces/IVariable';

export const count = (str) => {
    const re = new RegExp('comment data-tooltip', 'g');
    return ((str || '').match(re) || []).length;
};

export const replaceComment = (str, searchParam, body) => {
    let newString = '';

    console.log('str1', str);
    console.log('searchParam', searchParam);

    newString = str.replace(searchParam, body);
    console.log('str2', newString);

    return newString;
};

export const replaceTextQuill = (text: string, variables: Array<IVariableLight>) => {
    if (!text || !variables) {
        return '';
    }
    let newString = text;

    //Find by mentions
    for (var i = 0; i < variables.length; i++) {
        const valueMention = variables[i].value;
        const regex = new RegExp(`data-value="${valueMention}"`, 'g');
        newString = newString.replaceAll(regex, `data-value="${valueMention}" data-index="${variables[i]._id}"`);
    }

    return newString;
};

export const replaceText = (text: string, variables: Array<IVariableLight>) => {
    if (!text || !variables) {
        return '';
    }
    let newString = text;

    //Find by mentions
    for (var i = 0; i < variables.length; i++) {
        const valueMention = variables[i].value;
        const regex = new RegExp(`@${valueMention}`, 'g');

        newString = newString.replaceAll(regex, variables[i].name);
    }

    return newString;
};
