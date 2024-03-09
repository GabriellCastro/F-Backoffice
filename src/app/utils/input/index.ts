export const allowOnlyLetters = (
    event: React.KeyboardEvent<HTMLInputElement>,
) => {
    const key = event.key;
    if (/\d/.test(key)) event.preventDefault();
};

export const allowOnlyNumbers = (
    event: React.KeyboardEvent<HTMLInputElement>,
) => {
    const ctrlDown = event.ctrlKey || event.metaKey;

    const isNumericInput =
        (event.key >= "0" && event.key <= "9") ||
        event.key === "Backspace" ||
        event.key === "Delete" ||
        event.key === "Tab" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        (ctrlDown && event.key === "x") ||
        (ctrlDown && event.key === "c") ||
        (ctrlDown && event.key === "a") ||
        (ctrlDown && event.key === "z") ||
        (ctrlDown && event.key === "v") ||
        (ctrlDown && event.key === "ArrowLeft") ||
        (ctrlDown && event.key === "ArrowRight") ||
        (ctrlDown && event.shiftKey && event.key === "ArrowLeft") ||
        (ctrlDown && event.shiftKey && event.key === "ArrowRight");

    if (!isNumericInput) event.preventDefault();
};
