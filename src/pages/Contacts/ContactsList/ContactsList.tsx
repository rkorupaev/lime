// @ts-nocheck
import React from 'react';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import contactsStore, {Contact} from "../../../stores/contactsStore";
import {observer} from "mobx-react-lite";

const ContactsList = () => {
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        contactsStore.setSelectedContactIndex(index);
    };

    return (
        <>
            <List component="nav" aria-label="secondary mailbox folder" sx={{
                maxWidth: '300px',
                minWidth: '300px',
                maxHeight: 'calc(100vh - 145px)',
                minHeight: 'calc(100vh - 145px)',
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                overflowY: 'auto'
            }}>
                {contactsStore.contacts.length ? contactsStore.contacts.map(({items, data_id}: Contact, index: number) => {
                    return (
                        <ListItemButton
                            selected={contactsStore.selectedContactIndex === index}
                            onClick={(event) => handleListItemClick(event, index)}
                            key={index}
                        >
                            <ListItemText
                                primary={contactsStore.contactItemsHandler(items, 'name')?.data1 || contactsStore.contactItemsHandler(items, 'nickname')?.data1 || contactsStore.contactItemsHandler(items, 'phone_v2')?.data1 || 'Имя не указано'}
                                sx={{wordBreak: 'break-all'}}
                                secondary={items.some(item => item.deleted) && 'Удален'}/>
                        </ListItemButton>
                    );
                }) : <ListItemText
                    primary="Список контактов пуст"
                    sx={{wordBreak: 'break-all', ml: '24px'}}/>}
            </List>
        </>
    );
};

export default observer(ContactsList);
