import axios from "axios";
import { API_KEY_PARAM, BASEURL } from "constants/omdbApi";

export const omdbAxios = axios.create({
  baseURL: BASEURL,
  timeout: 2000,
});

omdbAxios.interceptors.request.use((config) => {
  config.params[API_KEY_PARAM] = process.env.REACT_APP_OMDB_API_KEY;
  return config;
});

omdbAxios.interceptors.response.use(
  // response interceptors
  (response) => {
    console.log("response", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  }
);
