// @ts-nocheck
import {makeAutoObservable, toJS} from "mobx";

export interface Contact {
    log_time: string,
    device_id: string,
    contact_id: string,
    id: number,
    items: ContactItem[],
};

export interface ContactItem {
    data_id: number,
    raw_id: number,
    account_name: string,
    account_type: string,
    deleted: false,
    starred: false,
    is_primary: false,
    mimetype: string,
    data1: string,
    data: {}
}

class ContactsStore {

    contacts: Contact[] = []

    selectedContactIndex: number | null = null;
    selectedContact: unknown | null = null;

    isLoading: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    setContacts(data: Contact[]) {
        this.contacts = data;
    }

    setSelectedContactIndex(index: number | null) {
        this.selectedContactIndex = index;
        this._setSelectedContact(index);
    }

    _setSelectedContact(index: number | null) {
        if (index === null) this.selectedContact = null;
        else this.selectedContact = this.contacts[index];
    }

    contactItemsHandler(items: ContactItem[], type: string): ContactItem | null {
        const item = items.filter(item => item.mimetype.includes(type));
        return item ? item[0] : null;
    }

    setIsLoading(status) {
        this.isLoading = status;
    }

    addContact(contact) {
        this.contacts.push(contact);
    }

    deleteContact(id) {
        const copy = structuredClone(toJS(this.contacts));
        const deletedContactIndex = copy.findIndex(item => item.contact_id == id);
        copy[deletedContactIndex].items[0].deleted = true;
        this.contacts = copy;
        this.selectedContact.items[0].deleted = true;
    }
}

export default new ContactsStore();
