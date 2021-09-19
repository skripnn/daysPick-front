import {LinearProgress, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import React from "react";
import './Item.css'


export default function Item({avatar, primary, secondary, third, action, onClick, className, progress, slim, ...otherProps}) {
  return (
    <ListItem button onClick={onClick} className={`item ${slim ? 'slim ' : ''} ${className || ''}`} {...otherProps} >
      {!!progress && <LinearProgress className={'progress'} color={'secondary'}/>}
      {!!avatar &&
      <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
        {avatar}
      </ListItemIcon>
      }
      <ListItemText
        primaryTypographyProps={{className: 'item-text'}}
        secondaryTypographyProps={{className: 'item-text'}}
        primary={primary}
        secondary={secondary}
      />
      {!!third &&
      <ListItemText
        secondary={third}
        secondaryTypographyProps={{className: 'item-third'}}
      />
      }
      {!!action &&
      <ListItemSecondaryAction className={`item button${slim ? ' slim ' : ''}`}>
        {action}
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}
