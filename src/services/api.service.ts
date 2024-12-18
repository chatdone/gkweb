import axios from 'axios';

import useAuth0Session from '@/hooks/useAuth0Session';

import Configs from '@/configs';

const apiService = axios.create({
  baseURL: Configs.env.API_URL,
  timeout: 20000,
  withCredentials: true,
});

apiService.interceptors.request.use(function (request) {
  const { getToken } = useAuth0Session();
  const token = getToken();

  request.headers = {
    Authorization: token ? `Bearer ${token}` : '',
  };

  return request;
});

apiService.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      Configs.GK_ENVIRONMENT !== 'production' ||
      Configs.GK_ENVIRONMENT !== 'staging'
    ) {
      console.log('api fail', error);
    }
    return Promise.reject(error);
  },
);

export default apiService;
