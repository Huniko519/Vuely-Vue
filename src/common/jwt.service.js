const ID_TOKEN_KEY = "token";
const CLIENT_GROUP = "CLIENT_GROUP";
const USER_GROUP = "USER_GROUP";

export const getToken = () => {
    return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = token => {
    window.localStorage.setItem(ID_TOKEN_KEY, token);
};

export const destroyToken = () => {
    window.localStorage.removeItem(ID_TOKEN_KEY);
};

export const getClientData = () => {
    return { CLIENT_GROUP: window.localStorage.getItem(CLIENT_GROUP), USER_GROUP: window.localStorage.getItem(USER_GROUP) };
};

export const saveClientData = (client_group, user_group) => {
    window.localStorage.setItem(CLIENT_GROUP, client_group);
    window.localStorage.setItem(USER_GROUP, user_group);
};

export const destroyClientData = () => {
    window.localStorage.removeItem(CLIENT_GROUP);
    window.localStorage.removeItem(USER_GROUP);
};

export default { getToken, saveToken, destroyToken, getClientData, saveClientData, destroyClientData };
