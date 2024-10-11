"use strict";

import Vue from "vue";
import axios from "axios";

const {
    VUE_APP_SARA_RECV_HOST: saraRecvHost,
    VUE_APP_SARA_TOKEN_NAME: saraTokenName,
} = process.env;

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || "";
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const config = {
    baseURL: saraRecvHost,
    timeout: 60 * 1000,
};

const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(
    // Do something before request is sent
    (config) => {
        const saraToken = localStorage.getItem(saraTokenName);
        if (!saraToken) {
            return config
        }

        config.headers["Authorization"] = `SARA ${saraToken}`;
        return config;
    },
    // Do something with request error
    (error) => Promise.reject(error),
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    // Do something with response data
    (response) => {
        const newSaraToken = response.headers["sara-issue"];
        if (!newSaraToken) {
            return response;
        }

        localStorage.setItem(saraTokenName, newSaraToken);
        return response;
    },
    // Do something with response error
    (error) => Promise.reject(error),
);

const getProfile = async () => {
    if (!localStorage.getItem(saraTokenName)) {
        return null;
    }

    try {
        const xhr = await axiosClient.get('/users/me');
        return xhr?.data?.profile || false;
    } catch (e) {
        if (e?.response?.status !== 401) {
            console.warn(e);
            return null;
        }

        localStorage.removeItem(saraTokenName);
        location.reload();
        return null;
    }
};

const extension = {
    install: (Vue) => {
        window.sara = axiosClient;
        Vue.sara = axiosClient;
        Vue.prototype.sara = axiosClient;
        Vue.prototype.$sara = axiosClient;

        window.profile = getProfile;
        Vue.profile = getProfile;
        Vue.prototype.profile = getProfile;
        Vue.prototype.$profile = getProfile;
    },
};

Vue.use(extension);

export default extension;
