import React from "react";
import "./buttons-block.css"
import {AccountCircle} from "@material-ui/icons";
import {Button} from "@material-ui/core";

export default function UserButton(props) {

  return (
      <Button variant="outlined" id="user-button" startIcon={<AccountCircle fontSize="small"/>}>
          {props.user.username}
      </Button>
  );
}