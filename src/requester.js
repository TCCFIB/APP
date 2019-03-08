import axios from 'axios';

const storage = window.localStorage;
const baseUrl = storage.getItem('baseUrl') ? storage.getItem('baseUrl') : 'http://localhost';

/* eslint-disable max-len */
export default axios.create({
  baseURL: `${baseUrl}/API/public/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
