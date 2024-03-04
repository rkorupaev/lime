// @ts-nocheck
import React, {FC} from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import {FilledInputProps, InputBaseComponentProps, InputProps, OutlinedInputProps} from '@mui/material'

interface Props {
    label: string
    value: string
    onChange: () => void
    onFocus?: () => void
    onBlur?: () => void
    disabled?: boolean
    type?: string
    inputIcon?: Partial<FilledInputProps> | Partial<OutlinedInputProps> | Partial<InputProps> | undefined
    error?: boolean
    inputProps?: InputBaseComponentProps | undefined
    required?: boolean
    helperText?: string
    autoFocus?: boolean
    labelWidth?: string
    labelMinWidth?: string
    style?: Object
    autoComplete?: string
    placeholder?: string
    multiline?: boolean
    rows?: number
}

const LabelAndInput = ({
    label,
    value,
    onChange,
    onFocus = () => {},
    disabled,
    type = 'text',
    inputIcon = {},
    error,
    inputProps,
    required,
    helperText,
    autoFocus,
    labelWidth = '150px',
    labelMinWidth = '117px',
    style = {},
    autoComplete,
    placeholder,
    onBlur,
    multiline,
    rows = 3,
}: Props) => {
    return (
        <Box
            sx={Object.assign(
                {},
                {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px'},
                style
            )}
        >
            <Typography variant='p' component='p' sx={{width: labelWidth, minWidth: labelMinWidth}}>
                {label} :
            </Typography>
            <TextField
                variant='outlined'
                size='small'
                value={value}
                onChange={onChange}
                sx={{
                    flexGrow: 1,
                    '& .MuiFormHelperText-root': {
                        position: 'absolute',
                        top: '7px',
                        right: '0',
                        pointerEvents: 'none',
                    },
                }}
                disabled={disabled}
                type={type}
                InputProps={inputIcon}
                error={error}
                inputProps={inputProps}
                required={required}
                helperText={helperText}
                autoFocus={autoFocus}
                onFocus={onFocus}
                autoComplete={autoComplete}
                placeholder={placeholder}
                onBlur={onBlur}
                multiline={multiline}
                rows={rows}
            />
        </Box>
    )
}

export default LabelAndInput
