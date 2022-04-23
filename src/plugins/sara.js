"use strict";

import Vue from "vue";
import axios from "axios";

const config = {
    baseURL: process.env.VUE_APP_SARA_RECV_HOST,
    timeout: 60 * 1000,
};

const _client = axios.create(config);

_client.interceptors.request.use(
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

_client.interceptors.response.use(
    function (response) {
        if ("sara-issue" in response?.headers) {
            localStorage.setItem(
                process.env.VUE_APP_SARA_TOKEN_NAME,
                response.headers["sara-issue"]
            );
        }
        return response;
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error);
    }
);

const extension = {
    install: (Vue) => {
        Vue.prototype.$sara = _client;
        Vue.prototype.$profile = async () => {
            if (!localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME)) return null;
            try {
                const xhr = await _client.get('profile');
                return xhr?.data?.profile || false;
            } catch (e) {
                if (e?.response?.status === 401) {
                    localStorage.removeItem(process.env.VUE_APP_SARA_TOKEN_NAME);
                    location.reload();
                }
                return false;
            }
        }
    }
}

Vue.use(extension)

export default extension;
