import TouchHold from "../../js/TouchHold";
import {newDate} from "../../js/functions/date";
import {ListItem, ListItemSecondaryAction, ListItemText, Popover} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useRef, useState} from "react";
import {AssignmentTurnedIn, CheckBox, CheckBoxOutlineBlank, MoreHoriz} from "@material-ui/icons";
import "./ProjectItem.css"
import {isMobil} from "../../js/functions/functions";

function ProjectItem(props) {
  const onTouchHold = new TouchHold(props.onTouchHold, props.onTouchEnd)
  const project = props.project
  const past = project.date_end < newDate().format()
  const [deleting, setDeleting] = useState(false)
  const className = 'project-item' + (past ? ' past' : '') + (deleting ? ' deleting' : '')

  const paidToggle = (
    <IconButton edge="end" disabled={deleting} onClick={() => {
      setDeleting(true)
      setTimeout(() => props.paidToggle(project), 1000)
    }}>
      {deleting ? <CheckBox/> : <CheckBoxOutlineBlank/>}
    </IconButton>
  )

  const delProject = (
    <IconButton edge="end" disabled={deleting} onClick={() => {
      // eslint-disable-next-line no-restricted-globals
      if (!confirm('Удалить проект?')) return
      setDeleting(true)
      setTimeout(() => props.onDelete(project), 1000)
    }}>
      <DeleteIcon/>
    </IconButton>
  )

  const confirmProject = (
    <ActionsMenu>
      <IconButton disabled={deleting} onClick={() => props.onDelete(project)}>
        <DeleteIcon/>
      </IconButton>
      <IconButton onClick={() => props.confirmProject(project)}>
        <AssignmentTurnedIn />
      </IconButton>
    </ActionsMenu>
  )

  let secondaryAction = null
  if (props.confirmProject && project.is_wait) secondaryAction = confirmProject
  else if (props.paidToggle && props.onDelete) secondaryAction = past ? paidToggle : delProject
  else if (props.onDelete) secondaryAction = delProject
  else if (props.paidToggle) secondaryAction = paidToggle

  return (
    <ListItem
      className={className}
      onMouseOver={props.onMouseOver}
      onMouseLeave={props.onMouseLeave}
      button
      onClick={deleting? undefined : () => props.onClick(project)}
      {...onTouchHold.actions}
    >
      <ListItemText primary={project.title} secondary={project.client ? (isMobil() ? project.client.name : project.client.fullname): null}/>
      {(project.money === 0 || !!project.money) &&
      <ListItemText
        secondary={new Intl.NumberFormat('ru-RU').format(project.money) + " ₽"}
        style={{textAlign: "right", whiteSpace: "nowrap"}}/>
      }
      {!!secondaryAction &&
      <ListItemSecondaryAction className={className}>
        {secondaryAction}
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

export default ProjectItem

function ActionsMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef()
  return (
    <>
      <IconButton ref={ref} edge="end" onClick={() => setAnchorEl(ref.current)}>
        <MoreHoriz/>
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
          {props.children}
      </Popover>
    </>
  )
}