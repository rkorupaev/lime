// @ts-nocheck
import axiosInstance from "../utils/axiosInstance";
import {Contact} from "stores/contactsStore";

const BASE_AUTH_URL = '/api/front/v1/';

export interface GetContactsConfig {
    id?: string
    contact_id?: string;
}


export default class ContactsService {
    static  getContacts(config: GetContactsConfig ): Promise<Contact[]> {
        const id = config.id;
        delete config.id;
        return  axiosInstance.get(BASE_AUTH_URL + 'contacts/'+id, {params: config});
    }
}
