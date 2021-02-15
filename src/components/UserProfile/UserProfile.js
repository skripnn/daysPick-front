import React, {useState} from "react";
import './UserProfile.css'
import {inject, observer} from "mobx-react";
import PositionTags from "../PositionTags/PositionTags";
import Box from "@material-ui/core/Box";
import {Edit} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";

function UserProfile(props) {
  const {setValue, positions} = props.ProfileStore
  const self = props.ProfileStore.username === localStorage.User
  const [edit, setEdit] = useState(false)

  return (
    <div className={'user-profile'}>
      <Box display={"flex"}>
      <Box flexGrow={1}>
      <PositionTags positions={positions} setPositions={(v) => setValue({positions: v})} edit={edit}/>
      </Box>
      {self && <Box>
        <IconButton size={"small"} onClick={() => setEdit(!edit)}>
          <Edit className={edit ? "pick" : undefined}/>
        </IconButton>
      </Box>}
      </Box>
    </div>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getUser().user
}))(observer(UserProfile))