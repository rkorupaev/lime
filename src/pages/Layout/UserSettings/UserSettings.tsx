// @ts-nocheck
import React, {useState} from 'react';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const UserSettings = ({setChangeUserPasswordModalOpened}: {setChangeUserPasswordModalOpened: React.Dispatch<React.SetStateAction<boolean>>,}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton aria-label="delete" aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick} sx={{mr: '8px', }}>
                <ManageAccountsIcon color='inherit'/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => setChangeUserPasswordModalOpened(true)}>Сменить пароль</MenuItem>
            </Menu>
        </div>
    );
};

export default UserSettings;