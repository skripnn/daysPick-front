import {List, ListItem, ListItemIcon, ListItemText, Popover} from "@material-ui/core";
import {EventBusy} from "@material-ui/icons";
import React from "react";

export default function PopOverDay(props) {
  const {onClose, anchorEl, dayOff, info, onClick} = props
  if (!info && !dayOff) return null

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      style={{borderRadius: 4}}
    >
      <List dense disablePadding>
        {dayOff &&
        <ListItem divider>
          <ListItemIcon style={{minWidth: "unset", paddingRight: 4}}>
            <EventBusy fontSize={"small"}/>
          </ListItemIcon>
          <ListItemText secondary={"Выходной"}/>
        </ListItem>
        }
        {!!info && info.map(i =>
          <ListItem key={i.project.id} divider button={!!onClick}>
            <ListItemText
              primary={i.project.title}
              secondary={i.info}
              secondaryTypographyProps={{style: {whiteSpace: "pre-line"}}}
              onClick={onClick ? () => onClick(i.project) : undefined}
            />
          </ListItem>
        )}
      </List>
    </Popover>
  )
}