export const generateCode = (prefix: string, digits: number = 7) => {
    const randomCode = Math.floor(Math.random() * 10 ** digits)
        .toString()
        .padStart(digits, "0");
    return `${prefix}-${randomCode}`;
};
