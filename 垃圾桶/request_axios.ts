import tokenStore from "@/stores/tokenStore";
import axios from "axios";
import { progress } from "wsvaio";




const { DEV, VITE_BASE_API } = import.meta.env;
const request = axios.create({
  baseURL: DEV ? "" : VITE_BASE_API,
  timeout: 0,
  headers: {
    "content-type": "sdkf",
  }

});


request.interceptors.request.use(config => {

  progress.start();
  
  const oToken = tokenStore();
  Object.assign(config.headers, { Authorization: "Bearer" });
  return config;

}, error => {
  progress.done(false);
  ElNotification.success(error);
  return Promise.reject(error);
});




request.interceptors.response.use(({ config, data }) => {
  progress.done();
  if (DEV) console.info(config.method, config.url, "\n", typeof config.data == "string" ? JSON.parse(config.data) : config.data, "\n", data);
  return data;
}, ({ response, message }) => {
  progress.done(false);
  return Promise.reject(response);
});


export const { post, get, put, patch, delete: del } = request;

export default request;



