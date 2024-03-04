// @ts-nocheck
import * as React from 'react';
import Box from '@mui/material/Box';
import ContactsList from "../Contacts/ContactsList/ContactsList";
import ContactInfo from "../Contacts/ContactInfo/ContactInfo";
import {useMutation} from "@tanstack/react-query";
import snackbarStore, {Severity} from "../../stores/snackbarStore";
import {useEffect, useState} from "react";
import contactsStore from "../../stores/contactsStore";
import ContactsService from "../../services/ContactsService";
import deviceStore from "../../stores/deviceStore";
import FilterAndSyncBlock from "../../shared/FilterAndSyncBlock/FilterAndSyncBlock";
import AddIcon from '@mui/icons-material/Add';
import Button from "@mui/material/Button";
import {Tooltip} from "@mui/material";
import ModalWrapper from "../../shared/Modal/Modal";
import AddContactModal from "../../shared/Modal/AddContactModal/AddContactModal";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteContactModal from "../../shared/Modal/DeleteContactModal/DeleteContactModal";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";


export const Contacts = observer(() => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [openAddContactModal, setOpenAddContactModal] = useState<boolean>(false);
    const [openDeleteContactModal, setOpenDeleteContactModal] = useState<boolean>(false);


    const {
        mutateAsync: getContacts,
        error: getContactsError,
        isLoading: getContactsLoading,
    } = useMutation({
        mutationFn: ContactsService.getContacts,
        retry: (err: unknown) => {
            if (err.response?.status === 400) {
                return false;
            }
        },
        onMutate: () => {
            contactsStore.setIsLoading(true);
        },
        onSuccess: (data: unknown) => {
            contactsStore.setContacts(data.data);
        },
        onError: (data: unknown) => {
            snackbarStore.setSnackbarSettings({
                label: data.data.detail,
                severity: Severity.error,
                opened: true
            });
        },
        onSettled: () => {
            contactsStore.setIsLoading(false);
        }
    });

    useEffect(() => {
        if (deviceStore.currentDevice) getContacts({id: deviceStore.currentDeviceIndex});
    }, []);

    const filterContacts = () => {
        if (deviceStore.currentDevice) getContacts({id: deviceStore.currentDeviceIndex, full_search: searchValue});
    }

    const clearSearch = () => {
        setSearchValue('');
        if (deviceStore.currentDevice) getContacts({id: deviceStore.currentDeviceIndex});
    }

    return (
        <Box sx={{
            display: 'flex', mt: '64px', width: '100%'
        }}>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                }}
            >
                <Box sx={{display: 'flex', m: '12px'}}>
                    <FilterAndSyncBlock searchValue={searchValue} onSearchValueChange={setSearchValue}
                                        onFilter={filterContacts}
                                        onSync={() => deviceStore.currentDevice && getContacts({
                                            id: deviceStore.currentDeviceIndex,
                                            full_search: searchValue
                                        })}
                                        isLoading={contactsStore.isLoading} onClear={clearSearch}/>
                    <Tooltip title='Добавить контакт' placement='top'>
                        <Button variant='contained'
                                onClick={() => setOpenAddContactModal(true)}
                                sx={{ml: 'auto'}}
                        >
                            <AddIcon/>
                        </Button>
                    </Tooltip>
                    <Tooltip title={!contactsStore.selectedContact ? '' : 'Удалить контакт'} placement='top'>
                        <Button variant='contained'
                                onClick={() => setOpenDeleteContactModal(true)}
                                sx={{ml: '12px'}}
                                disabled={!contactsStore.selectedContact || contactsStore.selectedContact.items.some(item => item.deleted)}
                        >
                            <DeleteIcon/>
                        </Button>
                    </Tooltip>
                </Box>
                <Box sx={{display: 'flex', borderTop: '1px solid rgba(0, 0, 0, 0.12)'}}>
                    <ContactsList/>
                    <ContactInfo/>
                </Box>
            </Box>
            <ModalWrapper open={openAddContactModal} setOpen={setOpenAddContactModal}
                          modalTitle='Добавить контакт'>
                <AddContactModal handleClose={setOpenAddContactModal}/>
            </ModalWrapper>
            <ModalWrapper
                open={openDeleteContactModal}
                setOpen={setOpenDeleteContactModal}
                modalTitle='Удалить контакт?'
            >
                <DeleteContactModal handleClose={setOpenDeleteContactModal}/>
            </ModalWrapper>
        </Box>
    );
})
