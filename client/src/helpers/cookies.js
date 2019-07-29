import Cookies from "js-cookie";

const getCookie=(key)=> {
    return Cookies.get(key);
};

const setCookie=(key, value)=> {
    return Cookies.set(key, value);
};

const removeCookie=(key)=> {
    return Cookies.remove(key);
};

export {
    getCookie,
    setCookie,
    removeCookie
};

