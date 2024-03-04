// @ts-nocheck
import React from 'react'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import {NavLink, useLocation} from 'react-router-dom'
import ListItemIcon from '@mui/material/ListItemIcon'
import clsx from 'clsx'

const NestedList = ({items}) => {
    const location = useLocation()

    return (
        <List>
            {items.map(({key, label, icon: Icon, items, color, route}) => {
                return (
                    <ListItem
                        key={key}
                        disablePadding
                        component={NavLink}
                        to={route}
                        sx={{color: 'inherit'}}
                        className={clsx(location.pathname.includes(route) && 'bg-slate-200')}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon color={color} />
                            </ListItemIcon>
                            <ListItemText primary={label} sx={{maxWidth: '240px', whiteSpace: 'break-spaces'}} />
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default NestedList
