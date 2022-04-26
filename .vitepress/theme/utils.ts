export const toDate = (date: string) => new Date(date).toISOString().split('T')[0];

export const toTitle = (str: string) => str.replace('--', '\u{2013}');
