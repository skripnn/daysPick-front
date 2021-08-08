import {ListItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";

function ProfileInfo({user}) {
  return (
    <ListItem>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {user.info.split('\n').map((p, n) =>
          <Typography variant={'body2'} style={{minHeight: 20, opacity: 0.8}} key={n}>
            {p}
          </Typography>
        )}
      </div>
    </ListItem>
  )
}

export default ProfileInfo
