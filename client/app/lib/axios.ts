import axios, { CreateAxiosDefaults } from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

const axiosConfig: CreateAxiosDefaults = {
	baseURL,
};

export const request = axios.create({ ...axiosConfig });
