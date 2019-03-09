import axios from 'axios';

const storage = window.localStorage;
const baseUrl = storage.getItem('baseUrl') ? storage.getItem('baseUrl') : 'http://rayssa.simpleuse.com.br/api';

/* eslint-disable max-len */
export default axios.create({
  baseURL: `${baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});
