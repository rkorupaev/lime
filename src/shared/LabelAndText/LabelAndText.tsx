// @ts-nocheck
import React from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const variants = {
    'medium_regular': {
        label: {minWidth: '150px', width: '150px', fontSize: '14px'},
        text: {display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: '14px', fontSize: '14px'}
    },
    'small': {
        label: {minWidth: '100px', width: '100px', fontSize: '12px', fontWeight: '500'},
        text: {display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: '14px', fontSize: '12px'}
    },
    'medium': {
        label: {minWidth: '150px', width: '150px'},
        text: {display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: '14px'}
    },
    'info': {
        label: {minWidth: '175px', width: '175px', fontSize: '12px'},
        text: {display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: '14px', fontSize: '12px'}
    },
    'short_label': {
        label: {minWidth: '100', width: '100', fontSize: '14px'},
        text: {display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: '14px'}
    }
}

export interface LabelAndInputProps {
    label: string,
    text: string,
    variant?: LabelVariants,
    fixed?: boolean,
    color?: string,
}

export enum LabelVariants {
    'info' = "info",
    'medium' = "medium",
    'small' = "small",
    'medium_regular' = "medium_regular",
    'short_label' = "short_label",
}

const LabelAndText = ({label, text, variant = 'medium', fixed, color}: LabelAndInputProps) => {
    let blockText = '';

    const spanStyle = {
        display: 'flex',
        backgroundColor: 'antiquewhite',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid black',
        borderRadius: '5px',
        marginRight: '4px',
        padding: '0 8px',
        marginBottom: '2px'
    };

    if (Array.isArray(text) && text.length !== 0) {
        blockText = text.map((item, index) => <span key={index} style={spanStyle}>{item}</span>)
    } else {
        blockText = text;
    }

    const setStyles = (variant, fixed) => {
        let styles = variants[variant];
        if (fixed) styles.text = {...styles.text, maxHeight: fixed + 'px', overflowY: 'auto'};
        return styles;
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Typography id="modal-modal-title" variant="p" component="p" sx={setStyles(variant).label}>
                {label}:
            </Typography>
            <Typography id="modal-modal-title" variant="p" component="p"
                        sx={Object.assign({}, setStyles(variant, fixed).text, {color: color})}>
                {blockText}
            </Typography>
        </Box>
    );
};

export default LabelAndText;
