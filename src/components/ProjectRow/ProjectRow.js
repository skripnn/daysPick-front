import TableRow from "@material-ui/core/TableRow";
import Hidden from "@material-ui/core/Hidden";
import TableCell from "@material-ui/core/TableCell";
import {Link} from "react-router-dom";
import React from "react";
import "./ProjectRow.css"
import {newDate} from "../../js/functions/date";

export function ProjectRow(props) {
  function onClick(e) {
    e.target.parentElement.querySelector('a').click()
  }

  const path = "/project/" + props.id + "/"
  let className = "project-list-row"
  if (props.date_end < newDate().format()) className += " past"

  return (
    <TableRow className={className} id={props.id} onClick={onClick}>
      <TableCell scope="row">
        {props.title}
        <Hidden><Link to={path}/></Hidden>
      </TableCell>
      <TableCell>{props.client? props.client.fullname : undefined}</TableCell>
      <Hidden xsDown>
        <TableCell >{props.money}</TableCell>
      </Hidden>
    </TableRow>
  )
}