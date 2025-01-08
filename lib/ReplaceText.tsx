import { IVariableLight } from '@interfaces/IVariable';

export const count = (str) => {
    const re = new RegExp('comment data-tooltip', 'g');
    return ((str || '').match(re) || []).length;
};

export const replaceComment = (str, searchParam, body) => {
    let newString = '';
    newString = str.replace(searchParam, body);

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

function escapeRegExp(str) {
    return str + '(?![_,-, ,*,=])';
}

export const replaceText = (text: string, variables: Array<IVariableLight>) => {
    if (!text || !variables) {
        return '';
    }
    let newString = text;

    //Find by mentions
    for (var i = 0; i < variables.length; i++) {
        const valueMention = variables[i].value;
        const regex = new RegExp(escapeRegExp(`@${valueMention}`), 'g');

        newString = newString.replaceAll(regex, variables[i].name);
    }

    return newString;
};
