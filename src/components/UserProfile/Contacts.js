import React from "react";
import {ListItem} from "@material-ui/core";
import {Call, Mail, Telegram} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

export default function Contacts({user}) {

  function autoContactItem([key, value]) {
    if (!value) return null

    const contactItemProps = {
      text: value,
    }

    if (key === 'phone') {
      contactItemProps.link = `tel:${contactItemProps.text}`
      contactItemProps.icon = <Call/>
      contactItemProps.noTargetBlank = true
    }
    else if (key === 'email') {
      contactItemProps.link = `mailto:${value}`
      contactItemProps.icon = <Mail/>
    }
    else if (key === 'telegram') {
      contactItemProps.link = `https://t.me/${value}`
      contactItemProps.icon = <Telegram/>
    }

    return <ContactItem {...contactItemProps}/>
  }

  return (
    <>
      {Object.entries(user.contacts).map(autoContactItem)}
    </>
  )
}

function ContactItem({text, link, icon, noTargetBlank}) {
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
