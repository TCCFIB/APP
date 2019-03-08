import axios from 'axios';

const storage = window.localStorage;
const baseUrl = storage.getItem('baseUrl') ? storage.getItem('baseUrl') : 'http://10.254.254.61';

/* eslint-disable max-len */
export default axios.create({
  baseURL: `${baseUrl}/API/public/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
