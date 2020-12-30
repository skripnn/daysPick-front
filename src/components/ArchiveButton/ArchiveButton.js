import React from "react";
import {IconButton, SvgIcon} from "@material-ui/core";
import './ArchiveButton.css'

const ArchiveIcon = (
  <SvgIcon fontSize={"small"}>
    <path d="M1.8 9l-.8-4h22l-.8 4h-2.029l.39-2h-17.122l.414 2h-2.053zm18.575-6l.604-2h-17.979l.688 2h16.687zm3.625 8l-2 13h-20l-2-13h24zm-8 4c0-.552-.447-1-1-1h-6c-.553 0-1 .448-1 1s.447 1 1 1h6c.553 0 1-.448 1-1z"/>
  </SvgIcon>
)


export default function ArchiveButton(props) {
  return (
    <IconButton children={ArchiveIcon} size={"small"} className={'icon-button archive' + (props.active? ' pick' : '')} onClick={props.onClick}/>
  )
}