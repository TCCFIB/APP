import axios from 'axios';

const storage = window.localStorage;
const baseUrl = storage.getItem('baseUrl') ? storage.getItem('baseUrl') : 'http://localhost/API/public/api';

/* eslint-disable max-len */
export default axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});
