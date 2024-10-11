"use strict";

import Vue from "vue";
import axios from "axios";

import {
    nanoid,
} from "nanoid";

const {
    VUE_APP_OCJI_HOST: ocjiRecvHost,
    VUE_APP_SARA_TOKEN_NAME: saraTokenName,
    VUE_APP_ZEBRA_TOKEN_NAME: zebraTokenName,
} = process.env;

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || "";
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const config = {
    baseURL: ocjiRecvHost,
    timeout: 60 * 1000,
};

const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(
    // Do something before request is sent
    (config) => {
        let zebraToken = localStorage.getItem(zebraTokenName);
        if (!zebraToken) {
            zebraToken = nanoid();
            localStorage.setItem(zebraTokenName, zebraToken);
        }
        config.headers["X-Zebra-Code"] = zebraToken;

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
    (response) => response,
    // Do something with response error
    (error) => Promise.reject(error),
);

const extension = {
    install: (Vue) => {
        window.axios = axiosClient;
        Vue.axios = axiosClient;
        Vue.prototype.axios = axiosClient;
        Vue.prototype.$axios = axiosClient;
    },
};

Vue.use(extension);

export default extension;
