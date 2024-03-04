// @ts-nocheck
import React, {useEffect, useState} from 'react';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import contactsStore from "../../../stores/contactsStore";
import {observer} from "mobx-react-lite";
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import EmailIcon from '@mui/icons-material/Email';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ContactInfoItem from "./ContactInfoItem/ContactInfoItem";
import EditNoteIcon from '@mui/icons-material/EditNote';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import DialerSipIcon from '@mui/icons-material/DialerSip';
import LanguageIcon from '@mui/icons-material/Language';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import Box from "@mui/material/Box";
import noImage from '../../../assets/no_contact_image.jpg';

const ContactInfo = () => {
    const processContact = (items) => {
        const result = {
            name: [],
            phone_v2: [],
            email_v2: [],
            photo: [],
            organization: [],
            im: [],
            nickname: [],
            note: [],
            'postal-address_v2': [],
            group_membership: [],
            website: [],
            contact_event: [],
            relation: [],
            sip_address: []
        };

        items.forEach(item => {
            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    if (item.mimetype.includes(key)) {
                        result[key].push(item.data1);
                    }
                }
            }
        });

        return result;
    }

    const [card, setCurrentCard] = useState({
        name: [],
        phone_v2: [],
        email_v2: [],
        photo: [],
        organization: [],
        im: [],
        nickname: [],
        note: [],
        'postal-address_v2': [],
        group_membership: [],
        website: [],
        contact_event: [],
        relation: [],
        sip_address: []
    });

    useEffect(() => {
        setCurrentCard(processContact(contactsStore.selectedContact?.items || []));
    }, [contactsStore.selectedContact]);

    const infoItems = [];

    const iconsEnum = {
        "phone_v2": PhoneIcon,
        "email_v2": EmailIcon,
        "postal-address_v2": LocationCityIcon,
        "organization": CorporateFareIcon,
        "note": EditNoteIcon,
        "contact_event": EmojiEventsIcon,
        "group_membership": GroupsIcon,
        "sip_address": DialerSipIcon,
        "website": LanguageIcon,
        "relation": EscalatorWarningIcon,
        "im": Diversity3Icon
    }

    const titlesEnum = {
        "phone_v2": "Телефон",
        "email_v2": "Эл. почта",
        "postal-address_v2": "Адрес",
        "organization": "Организация",
        "note": "Заметки",
        "contact_event": "Мероприятия",
        "group_membership": "Группа",
        "sip_address": "Ип телефон",
        "website": "Веб сайт",
        "relation": "Родственники",
        "im": "Соцсети"
    }

    for (const key in card) {
        if (card.hasOwnProperty(key)) {
            if (card[key].length && (key !== 'name' && key !== 'photo' && key !== 'nickname')) {
                infoItems.push(<ContactInfoItem key={key} label={titlesEnum[key]} icon={iconsEnum[key]}
                                                items={card[key]}/>)
            }
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            ml: '12px',
            mr: '12px',
            mt: '12px',
            width: '100%',
            maxHeight: 'calc(100vh - 154px)',
            minHeight: 'calc(100vh - 154px)',
        }}>
            {contactsStore.selectedContact ?
                <Stack spacing={0.5} sx={{width: '100%'}}>
                    <Box
                        component="img"
                        sx={{
                            height: 70,
                            width: 70,
                            borderRadius: '50px',
                            alignSelf: 'center',
                            mb: '12px !important',
                            border: '2px solid #1976d2',
                        }}
                        alt="contact avatar"
                        src={card.photo[0] ? `data:image/jpeg;base64,${card.photo[0]}` : noImage}
                    />
                    <Typography variant="body1" component='p' sx={{alignSelf: 'center'}}>
                        {card.name[0] || card.nickname[0] || card.email_v2[0] || "Имя не указано"}
                    </Typography>
                    {infoItems}
                </Stack>
                : <Typography variant="h5" component='h5' sx={{alignSelf: "center"}}>
                    Выберите контакт в списке
                </Typography>}
        </Box>
    );
};

export default observer(ContactInfo);
