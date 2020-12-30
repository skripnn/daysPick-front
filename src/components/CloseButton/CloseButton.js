import React from "react";
import {IconButton} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import './CloseButton.css'


export default function CloseButton(props) {
  return (
    <IconButton children={<CloseIcon fontSize={'small'}/>} size={"small"} className={'icon-button close'} onClick={props.onClick}/>
  )
}