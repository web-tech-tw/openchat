"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const config = {
    baseURL: process.env.VUE_APP_OCJI_HOST || '',
    timeout: 60 * 1000,
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME);
        if (token) {
            config.headers["Authorization"] = `SARA ${token}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

const extension = {
    install: (Vue) => {
        Vue.axios = _axios;
        window.axios = _axios;
        Object.defineProperties(Vue.prototype, {
            axios: {
                get() {
                    return _axios;
                }
            },
            $axios: {
                get() {
                    return _axios;
                }
            },
        });
    }
}

Vue.use(extension)

export default extension;
