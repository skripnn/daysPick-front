import Fetch from "../../../js/Fetch";
import TextField from "../TextField/TextField";
import {Avatar, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import React from "react";
import VkLogin from "../../SocialLogin/VkLogin/VkLogin";


export default function VkField(props) {
  const {value, set} = props

  function onChange(v) {
    Fetch.post('profile', {'vk_account': v}).then(set)
  }

  const field = <TextField
    InputLabelProps={{shrink: !!value, disabled: false}}
    style={!!value ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
    inputProps={{disabled: true, style: {cursor: 'pointer', height: value? 24: undefined}}}
    InputProps={{disabled: false}}
    label={'ВКонтакте'}
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
          <ListItemSecondaryAction style={{right: 0}}>
            <VkLogin onClick={() => onChange(null)} logOut/>
          </ListItemSecondaryAction>
          }
        </ListItem>
      </List>
      }
      {!!set ?
        <VkLogin onClick={onChange} children={field}/>
        : {field}
      }
    </div>
  )
}