import axios, { AxiosResponse } from 'axios';
import { GET_DOCUMENT, SERVER_API_URL } from '../constants/ApiEndpoints';

export const getDoc = (): Promise<AxiosResponse<any, any>> => {
    return axios.get<any>(SERVER_API_URL + GET_DOCUMENT)
}