import React from 'react';
import LabelAndInput from "../LabelAndInput/LabelAndInput";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import SearchIcon from '@mui/icons-material/Search';
import SyncIcon from '@mui/icons-material/Sync';
import ClearIcon from '@mui/icons-material/Clear';

export interface FilterAndSyncBlockProps {
    searchValue: string;
    onSearchValueChange: React.Dispatch<React.SetStateAction<string>>;
    onFilter: () => void;
    isLoading?: boolean;
    onSync: () => void;
    onClear?: () => void;
}

const FilterAndSyncBlock = ({searchValue, onSearchValueChange, onFilter, isLoading, onSync, onClear}: FilterAndSyncBlockProps) => {
    return (
        <Box sx={{display: 'flex'}}>
            <LabelAndInput label="Поиск" value={searchValue}
                           onChange={((e: React.FormEvent<HTMLInputElement>) => onSearchValueChange((e.target as HTMLTextAreaElement).value)) as () => void}
                           labelWidth={'70px'} labelMinWidth={'70px'}/>
            {onClear && <LoadingButton variant='contained'
                                       onClick={() => onClear && onClear()}
                                       sx={{ml: '14px'}}
                                       loading={isLoading}
            ><ClearIcon/></LoadingButton>}
            <LoadingButton variant='contained'
                           onClick={() => onFilter()}
                           sx={{ml: '14px'}}
                           loading={isLoading}><SearchIcon/></LoadingButton>
            <LoadingButton variant='contained'
                           onClick={() => onSync()}
                           sx={{ml: '14px'}}
                           loading={isLoading} startIcon={<SyncIcon/>}>Обновить</LoadingButton>
        </Box>
    );
};

export default FilterAndSyncBlock;
