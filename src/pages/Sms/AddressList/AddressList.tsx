// @ts-nocheck
import React from 'react';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {observer} from "mobx-react-lite";
import smsStore from "../../../stores/smsStore";

const AddressList = () => {
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: string,
    ) => {
        smsStore.setSelectedAdressIndex(index);
    };

    return (
        <>
            <List component="nav" sx={{
                maxWidth: '300px',
                minWidth: '300px',
                maxHeight: 'calc(100vh - 145px)',
                minHeight: 'calc(100vh - 145px)',
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                overflowY: 'auto'
            }}>
                {smsStore.addresses.length ? smsStore.addresses.map(({address}: { address: string }, index: number) => {
                    return (
                        <ListItemButton
                            selected={smsStore.selectedAdressIndex === address}
                            onClick={(event) => handleListItemClick(event, address)}
                            key={address}
                        >
                            <ListItemText
                                primary={address}
                                sx={{wordBreak: 'break-all'}}/>
                        </ListItemButton>
                    );
                }) : <ListItemText
                    primary="Список диалогов пуст"
                    sx={{wordBreak: 'break-all', ml: '24px'}}/>}
            </List>
        </>
    );
};

export default observer(AddressList);
