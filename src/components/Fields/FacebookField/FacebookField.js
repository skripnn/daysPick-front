import Fetch from "../../../js/Fetch";
import TextField from "../TextField/TextField";
import {Avatar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Clear} from "@material-ui/icons";
import FacebookLogin from "../../SocialLogin/FacebookLogin/FacebookLogin";
import React from "react";

export default function FacebookField(props) {
  const {value, set} = props

  function onChange(v) {
    Fetch.post('profile', {'facebook_account': v}).then(set)
  }

  const field = <TextField
    InputLabelProps={{shrink: !!value, disabled: false}}
    style={!!value ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
    inputProps={{disabled: true, style: {cursor: 'pointer', height: value? 24: undefined}}}
    InputProps={{disabled: false}}
    label={'Facebook'}
  />

  return (
    <div style={{position: "relative", width: '100%'}}>
      {!!value &&
      <List dense style={{
        zIndex: 5,
        paddingBottom: 'unset',
        paddingTop: 14,
        marginLeft: 0,
        marginRight: 0
      }}>
        <ListItem style={{paddingLeft: 'unset', paddingRight: 'unset'}}>
          <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
            <Avatar style={{zoom: 0.7}} src={value.picture}/>
          </ListItemIcon>
          <ListItemText primary={value.name} style={{whiteSpace: "nowrap", overflow: "hidden"}}/>
          {!!props.set &&
          <ListItemSecondaryAction style={{right: 3}}>
            <IconButton
              size={'small'}
              edge="end"
              onClick={() => onChange(null)}
            >
              {<Clear/>}
            </IconButton>
          </ListItemSecondaryAction>
          }
        </ListItem>
      </List>
      }
      {!!set ?
        <FacebookLogin onClick={onChange} children={field}/>
        : {field}
      }
    </div>
  )
}