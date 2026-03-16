const copy = async (text: string) => navigator.clipboard.writeText(text);

export const Clipboard = { copy };
