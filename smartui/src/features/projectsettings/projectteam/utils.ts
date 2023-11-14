export const getCookie =  (name:any) => {
    if (document.cookie.length > 0) {
        let c_start:any;
        let c_end:any;
        c_start = document.cookie.indexOf(name + "=");
        if (c_start != -1) {
            c_start = c_start + name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return undefined;
};

export const delCookie  =  (name:any) => {
    document.cookie = name + "=;expires=Fri, 31 Dec 1999 23:59:59 GMT;path=/";
};

export const setCookie = (name:any, value:any, expireDays:any) => {
    var exdate:any = new Date();
    if (!expireDays) expireDays = 30;
    exdate.setDate(exdate.getDate() + expireDays);
    document.cookie = name + "=" + escape(value) + ";path=/" +
        ((expireDays == null) ? "" : ";expires=" + exdate.toGMTString());
};

export const addCookie =  (name:any, value:any) => {
    if (getCookie(name) != undefined)
        delCookie(name);
        setCookie(name, value, 1);
};