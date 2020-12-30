import React from "react";
import {IconButton} from "@material-ui/core";
import './AddProjectButton.css'
import {Link} from "react-router-dom";
import {PostAdd} from "@material-ui/icons";

export default function AddProjectButton(props) {
  return (
    <Link to='/project/'>
      <IconButton children={<PostAdd/>} size={"small"} className={'icon-button add-project'} onClick={props.onClick}/>
    </Link>
  )
}