"use strict";

import Vue from "vue";
import { jwtDecode } from "jwt-decode";

const {
    VUE_APP_SARA_TOKEN_NAME: saraTokenName,
} = process.env;

export const useProfile = () => {
    const saraToken = localStorage.getItem(saraTokenName);
    if (!saraToken) {
        return null;
    }

    try {
        const data = jwtDecode(saraToken);
        if (Date.now() >= data.exp * 1000) {
            throw new Error("sara token expired");
        }
        return data?.user;
    } catch (e) {
        console.warn(e);
        localStorage.removeItem(saraTokenName);
        location.reload();
        return null;
    }
};

const extension = {
    install: (Vue) => {
        window.profile = useProfile;
        Vue.profile = useProfile;
        Vue.prototype.profile = useProfile;
        Vue.prototype.$profile = useProfile;
    },
};

Vue.use(extension);

export default extension;
