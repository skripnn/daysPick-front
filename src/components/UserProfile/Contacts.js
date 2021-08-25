import React from "react";
import {ListItem} from "@material-ui/core";
import {Call, Mail, Telegram} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

export default function Contacts({user}) {

  return (
    <>
      <ContactItem
        text={user.phone}
        link={`tel:${user.phone}`}
        icon={<Call/>}
        noTargetBlank
      />
      <ContactItem
        text={user.email}
        link={`mailto:${user.email}`}
        icon={<Mail/>}
      />
      <ContactItem
        text={user.telegram}
        link={`https://t.me/${user.telegram}`}
        icon={<Telegram/>}
      />
    </>
  )
}

function ContactItem({text, link, icon, noTargetBlank}) {
  if (!text) return null
  return (
    <ListItem className={'contacts-list-item'}>
      <a
        href={link}
        target={noTargetBlank ? undefined : '_blank'}
        rel={noTargetBlank ? undefined : 'noreferrer noopener'}
        className={'contacts-item'}
      >
        {icon}
        <Typography variant={'body1'}>{text}</Typography>
      </a>
    </ListItem>
  )
}
