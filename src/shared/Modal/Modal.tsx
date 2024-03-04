import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import {observer} from "mobx-react-lite";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
};

export interface ModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleCloseModal?: () => void;
    children: React.ReactNode;
    modalTitle: string;
}

const ModalWrapper = ({
                   open,
                   setOpen,
                   handleCloseModal,
                   children,
                   modalTitle,
               }: ModalProps) => {

    const handleClose = () => {
        setOpen(false);
        if (handleCloseModal) {
            handleCloseModal()
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{marginBottom: '12px'}}>
                    {modalTitle}
                </Typography>
                {children}
            </Box>
        </Modal>
    );
};

export default observer(ModalWrapper);
