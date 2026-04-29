export const getCookie = (name: string): string => {
    if (typeof window === 'undefined') return '';
    const row = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return row ? row.substring(name.length + 1) : '';
};