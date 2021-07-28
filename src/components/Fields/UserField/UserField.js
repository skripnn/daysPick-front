import TextField from "../TextField/TextField";
import React, {useState} from "react";
import {IconButton, List} from "@material-ui/core";
import UserChoiceDialog from "../../UserChoiceDialog/UserChoiceDialog";
import UserItem from "../../UserItem/UserItem";
import ClearIcon from "@material-ui/icons/Clear";
import mainStore from "../../../stores/mainStore";

function UserField({value, set, required, disabled, label}) {
  const user = typeof value === 'string' ? mainStore.UsersStore.getUser(value).user : value
  const [dialog, setDialog] = useState(false)

  return (<>
    <div style={{position: "relative"}}>
      {!!user &&
      <List dense style={{
        zIndex: !!value ? 5 : 0,
        paddingBottom: 'unset',
        paddingTop: 14,
        marginLeft: 0,
        marginRight: 0
      }}>
        <UserItem
          noTags
          onClick={() => setDialog(true)}
          secondaryAction={disabled ? null :
            <IconButton size={'small'} onClick={() => set(null)}><ClearIcon/></IconButton>}
          user={user}
        />
      </List>
      }
      <TextField
        required={required}
        InputLabelProps={{shrink: !!user, disabled: false}}
        style={!!user ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
        inputProps={{disabled: true, style: {cursor: 'pointer', height: 24}}}
        InputProps={{disabled: false}}
        label={label || 'Пользователь'}
        onClick={() => setDialog(true)}
      />
    </div>
    <UserChoiceDialog open={!disabled && dialog} close={() => setDialog(false)} onClick={set}/>
  </>)
}


export default UserField
