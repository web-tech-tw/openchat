"use strict";

import Vue from "vue";
import axios from "axios";

const extension = {
    install: (Vue) => {
        const token = localStorage.getItem(process.env.VUE_APP_SARA_TOKEN_NAME);
        const options = {baseURL: process.env.VUE_APP_SARA_RECV_HOST, headers: {Authorization: `SARA ${token}`}};
        Vue.prototype.$profile = async () => {
            const xhr = await axios.get('profile', options);
            return xhr?.data?.profile || null;
        }
    }
}

Vue.use(extension)

export default extension;
