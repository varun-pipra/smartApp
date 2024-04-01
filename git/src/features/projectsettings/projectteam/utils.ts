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

export const ProjectsData = [
    {
        "id": 548829,
        "value": 548829,
        "label": "Capital Common Projects",
        "name": "Capital Common Projects",
        "text": "Capital Common Projects",
        // "iconCls" : "common-icon-project-name",
        "img":"https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2311/zehqslg3/abc7.jpg"
    },
    {
        "id": 532018,
        "value": 532018,
        "label": "Capital Gateway Renovation",
        "name": "Capital Gateway Renovation",
        "text": "Capital Gateway Renovation",
        // "iconCls" : "common-icon-project-name",
        "img":"https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2311/zehqslg3/abc7.jpg"
    },
    {
        "id": 2866620,
        "value": 2866620,
        "label": "Capital Commercial Solutions",
        "name": "Capital Commercial Solutions",
        "text": "Capital Commercial Solutions",
        // "iconCls" : "common-icon-project-name",
        "img":"https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2311/zehqslg3/abc7.jpg"
    },
    {
        "id": 605844,
        "value": 605844,
        "label": "Capital City Business Park",
        "name": "Capital City Business Park",
        "text": "Capital City Business Park",
        // "iconCls" : "common-icon-project-name",
        "img":"https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2311/zehqslg3/abc7.jpg"
    },
    {
        "id": 3346359,
        "value": 3346359,
        "label": "East Side Enterprise Building",
        "name": "East Side Enterprise Building",
        "text": "East Side Enterprise Building",
        // "iconCls" : "common-icon-project-name",
        "img":"https://storage.googleapis.com/smartapp-appzones/5ba09a787d0a4ea1bc0f0c1420152d1c/iqadmin/dynamic/2311/zehqslg3/abc7.jpg"
    }
];
export const FiltersProjectsData = [
    {
        "id": 548829,
        "name": "Capital Common Projects",
        "label": "Capital Common Projects",
        "text": "Capital Common Projects",
        "value":"Capital Common Projects",
        // "iconType": "class",
        // "color": "#333333",
        // "iconCls" : "common-icon-project-name",
        // "icon" : "common-icon-project-name"
        "icon" : ""
    },
    {
        "id": 532018,
        "value": "Capital Gateway Renovation",
        "label": "Capital Gateway Renovation",
        "name": "Capital Gateway Renovation",
        "text": "Capital Gateway Renovation",
        // "iconType": "class",
        // "color": "#333333",
        // "iconCls" : "common-icon-project-name",
        // "icon" : "common-icon-project-name"
        "icon" : ""
    },
    {
        "id": 2866620,
        "value": "Capital Commercial Solutions",
        "label": "Capital Commercial Solutions",
        "name": "Capital Commercial Solutions",
        "text": "Capital Commercial Solutions",
        // "iconType": "class",
        // "color": "#333333",
        // "iconCls" : "common-icon-project-name",
        // "icon" : "common-icon-project-name"
        "icon" : ""
    },
    {
        "id": 605844,
        "value": "Capital City Business Park",
        "label": "Capital City Business Park",
        "name": "Capital City Business Park",
        "text": "Capital City Business Park",
        // "iconType": "class",
        // "color": "#333333",
        // "iconCls" : "common-icon-project-name",
        // "icon" : "common-icon-project-name"
        "icon" : ""
    },
    {
        "id": 3346359,
        "value": "East Side Enterprise Building",
        "label": "East Side Enterprise Building",
        "name": "East Side Enterprise Building",
        "text": "East Side Enterprise Building",
        // "iconType": "class",
        // "color": "#333333",
        // "iconCls" : "common-icon-project-name",
        "icon" : ""
    }
];