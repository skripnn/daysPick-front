import React, {useState} from "react";
import './UserProfile.css'
import PositionTags from "../PositionTags/PositionTags";
import Box from "@material-ui/core/Box";
import {Edit} from "@material-ui/icons";
import {IconButton} from "@material-ui/core";

function UserProfile(props) {
  const {setValue, positions, username} = props
  const self = username === localStorage.User
  const [edit, setEdit] = useState(!!props.edit)

  return (
    <div className={'user-profile'}>
      <Box display={"flex"}>
      <Box flexGrow={1}>
        <PositionTags positions={positions} set={!!setValue ? (v) => setValue({positions: v}) : undefined}/>
      </Box>
      {self && <Box>
        <IconButton size={"small"} onClick={() => setEdit(!edit)}>
          <Edit className={edit ? "edit-button pick" : "edit-button"}/>
        </IconButton>
      </Box>}
      </Box>
    </div>
  )
}

export default UserProfile