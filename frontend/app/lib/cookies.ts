export const getCookie = (name: string): string => {
    if (typeof window === 'undefined') return '';
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        ?.split('=')[1] || '';
};