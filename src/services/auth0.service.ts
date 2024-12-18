import axios from 'axios';

const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const tenant = import.meta.env.VITE_AUTH0_TENANT;
const defaultDatabase = import.meta.env.VITE_AUTH0_DEFAULT_DATABASE;

const apiService = axios.create({
  baseURL: `http://${tenant}`,
  timeout: 20000,
});

const sendChangePasswordEmail = async (email: string) => {
  return apiService.post('/dbconnections/change_password', {
    client_id: clientId,
    email,
    connection: defaultDatabase,
  });
};

export default {
  sendChangePasswordEmail,
};
