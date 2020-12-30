import pick from "../../js/functions/pick";
import TableRow from "@material-ui/core/TableRow";
import Hidden from "@material-ui/core/Hidden";
import TableCell from "@material-ui/core/TableCell";
import {Link} from "react-router-dom";
import React from "react";
import "./ProjectRow.css"

export function ProjectRow(props) {
  function onMouseOver() {
    pick("set", props.dates)
  }

  function onMouseLeave() {
    pick("unset", props.dates)
  }

  function onClick(e) {
    e.target.parentElement.querySelector('a').click()
  }

  const path = "/project/" + props.id + "/"
  let className = "project-list-row"
  if (props.is_paid) className += " paid"

  return (
    <TableRow className={className} id={props.id} onClick={onClick}
              onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <TableCell scope="row">
        {props.title}
        <Hidden><Link to={path}/></Hidden>
      </TableCell>
      <TableCell>{props.client}</TableCell>
      <Hidden xsDown>
        <TableCell >{props.money}</TableCell>
        <TableCell align="center" >{props.dates.length}</TableCell>
      </Hidden>
    </TableRow>
  )
}