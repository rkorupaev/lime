// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {Contact} from "stores/contactsStore";

const BASE_AUTH_URL = '/api/front/v1/';

export default class AccountsService {
    static  getAccounts(config: any): Promise<Contact[]> {
        const id = config.id;
        delete config?.id;
        return  axiosInstance.get(BASE_AUTH_URL + 'accounts/'+id, {params: config});
    }
}
