export const getMonthName = (month: number) => {
    switch (month) {
        case 1:
            return 'Január';
        case 2:
            return 'Február';
        case 3:
            return 'Marec';
        case 4:
            return 'Apríl';
        case 5:
            return 'Máj';
        case 6:
            return 'Jún';
        case 7:
            return 'Júl';
        case 8:
            return 'August';
        case 9:
            return 'September';
        case 10:
            return 'Október';
        case 11:
            return 'November';
        case 12:
            return 'December';
        default:
            throw new Error('Neplatný mesiac');
    }
};
