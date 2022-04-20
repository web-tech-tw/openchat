"use strict";

import Vue from "vue";
import axios from "axios";

const extension = {
    install: (Vue) => {
        const options = {baseURL: process.env.VUE_APP_SARA_RECV_HOST, headers: {Authorization: null}};
        Vue.prototype.$profile = async () => {
            const token = localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME);
            if (!token) return null;
            try {
                options.headers.Authorization = `SARA ${token}`;
                const xhr = await axios.get('profile', options);
                return xhr?.data?.profile || null;
            } catch (e) {
                if (e?.response?.status === 401) {
                    localStorage.removeItem(process.env.VUE_APP_SARA_TOKEN_NAME);
                    location.reload();
                }
                return null;
            }
        }
    }
}

Vue.use(extension)

export default extension;
