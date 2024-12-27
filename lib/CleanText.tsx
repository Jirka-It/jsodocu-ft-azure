export const CleanText = (value: string) => {
    var newVal = value;
    newVal = newVal.trim(); //toUpperCase()
    newVal = newVal.replace(' ', '');
    newVal = newVal.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    newVal = newVal.replace(/[^a-zA-Z0-9 _ -]/g, '');

    return newVal;
};
