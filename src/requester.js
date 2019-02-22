import axios from 'axios';

/* eslint-disable max-len */
export default axios.create({
  baseURL: 'http://localhost/API/public/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
