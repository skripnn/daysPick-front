import React, {useState} from "react";
import Fetch from "../../../js/Fetch";
import {
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import UserAvatar from "../../UserAvatar/UserAvatar";
import IconButton from "@material-ui/core/IconButton";
import {Clear, CloudUpload} from "@material-ui/icons";
import TextField from "../TextField/TextField";
import AvatarDialog from "../../AvatarDialog/AvatarDialog";


export default function AvatarField(props) {
  const [image, setImage] = useState()

  function loadImage() {
    props.photo? Fetch.getImage(props.photo).then(setImage) : setImage(null)
  }

  return (<>
    <div style={{position: "relative", width: '100%'}}>
      {!!props.value &&
      <List dense style={{
        zIndex: 5,
        paddingBottom: 'unset',
        paddingTop: 14,
        marginLeft: 0,
        marginRight: 0,
      }}>
        <ListItem button style={{paddingLeft: 'unset', paddingRight: 'unset'}} onClick={loadImage}>
          <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
            <UserAvatar avatar={props.value} full_name={props.full_name}/>
          </ListItemIcon>
          <ListItemText primary={" "} style={{whiteSpace: "nowrap", overflow: "hidden"}}/>
          <ListItemSecondaryAction style={{right: 0}}>
            <IconButton
              size={'small'}
              edge="end"
              onClick={() => Fetch.post('profile', {avatar: null, photo: null}).then(props.onChange).then(props.close)}
            >
              {<Clear/>}
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      }
      <TextField
        InputLabelProps={{shrink: !!props.value, disabled: false}}
        style={!!props.value ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
        inputProps={{disabled: true, style: {cursor: 'pointer', height: !!props.value ? 24 : undefined}}}
        InputProps={{disabled: false, endAdornment: !props.value? (
            <InputAdornment position={"end"}>
              <IconButton size={'small'} onClick={() => Fetch.post('profile', {avatar: null, photo: null}).then(props.onChange).then(props.close)}>
                <CloudUpload />
              </IconButton>
            </InputAdornment>
          ) : undefined}}
        label={'Аватар'}
        onClick={loadImage}
      />
    </div>
    {image !== undefined && <AvatarDialog close={() => setImage(undefined)} avatar={props.value} image={image} full_name={props.full_name} onChange={props.onChange}/>}
  </>)
}