import axios from 'axios';

const getIpLocation = () => {
  return axios.get(
    'http://ip-api.com/json/?fields=status,message,country,countryCode,timezone',
  );
};

export default {
  getIpLocation,
};
