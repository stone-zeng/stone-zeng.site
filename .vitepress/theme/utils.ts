export const isArray = (value: any) => Array.isArray(value);

export const isDate = (value: any) => value instanceof Date;

export const toTitle = (str: string) => str.replace('--', '\u{2013}');
