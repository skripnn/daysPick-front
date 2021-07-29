import {newDate} from "../../js/functions/date";
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useState} from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  AssignmentTurnedIn, Cancel,
  CheckBox,
  CheckBoxOutlineBlank, DoubleArrow,
  FolderOpen, Help, MoreHoriz, Person,
} from "@material-ui/icons";
import "./ProjectItem.css"
import Fetch from "../../js/Fetch";
import {formatDate} from "../../js/functions/functions";
import PopoverButtonsBlock from "../PopoverButtonsBlock/PopoverButtonsBlock";
import {useControlledState, useMobile, useTouchHold} from "../hooks";
import IconBadge from "../IconBadge/IconBadge";

export function ProjectItemAutoFolder({project, onTouchHold, onTouchEnd, onMouseOver, onMouseLeave, onClick, showOneChildFolder,
                                 open, childListFilter, childProps,
                                 onPaid, onDelete, onConfirm, confirmButton, paidButton, deleteButton}) {

  const isFolder = !!project.children && !!project.children.length
  const children = project.children ? childListFilter(project.children) : []
  let oneChild = isFolder && children.length === 1

  const commonProps = {
    onTouchHold: onTouchHold,
    onTouchEnd: onTouchEnd,
    onMouseOver: onMouseOver,
    onMouseLeave: onMouseLeave,
    onClick: onClick
  }

  const itemProps = {
    onPaid: onPaid,
    onDelete: onDelete,
    onConfirm: onConfirm,
    confirmButton: confirmButton,
    paidButton: paidButton,
    deleteButton: deleteButton
  }

  const Folder = (
    <ProjectFolderItem
      project={{...project, children: children}}
      {...commonProps}
      childProps={childProps ? childProps : {...commonProps, ...itemProps}}
      open={open}
    />
  )

  const Item = (
    <ProjectItem
      project={oneChild ? project.children[0] : project}
      {...commonProps}
      {...itemProps}
    />
  )

  return (!isFolder || (oneChild && !showOneChildFolder)) ? Item : Folder

}

ProjectItemAutoFolder.defaultProps = {
  showOneChildFolder: false,
  childListFilter: l => l
}

export function ProjectFolderItem({project, onTouchHold, onTouchEnd, onMouseOver, onMouseLeave, onClick, open, setOpen, childListFilter, childProps}) {
  const mobile = useMobile()
  const [folderOpen, setFolderOpen] = useControlledState(open, setOpen)

  let clients = [...new Set(project.children.map(p => p.client ? (mobile ? p.client.name : p.client.fullname) : null))]
  if (clients.includes(null)) clients = clients.filter(v => !!v).concat([null])
  const client = clients.length > 1 ? clients[0] + ', ...' : clients[0]

  const money = project.children.map(p => p.money || 0).reduce((a, b) => a + b, 0)

  const action = (
    <IconButton edge="end" onClick={() => setFolderOpen(!folderOpen)}>
      {folderOpen ? <ArrowDropUp/> : <ArrowDropDown/>}
    </IconButton>
  )
  const primary = (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <FolderOpen fontSize={"inherit"} style={{paddingRight: 4}}/>{project.title}
    </div>
  )

  return (<>
    <ProjectItemBase
      project={{...project, money: money}}
      primary={primary}
      secondary={client}
      action={action}
      onTouchHold={onTouchHold}
      onTouchEnd={onTouchEnd}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
    {folderOpen && childListFilter(project.children).map(p =>
      <ProjectItem
        child
        {...childProps}
        project={p}
        key={p.id}
      />
    )}
  </>)

}

ProjectFolderItem.defaultProps = {
  childProps: {},
  childListFilter: (l) => l
}

export function ProjectItem({project, child, onTouchHold, onTouchEnd, onMouseOver, onMouseLeave, onClick,
                               onConfirm, onPaid, onDelete, confirmButton, paidButton, deleteButton}) {
  const [transparent, setTransparent] = useState(false)

  function onHandleDelete() {
    Fetch.delete(['project', project.id]).then(() => onDelete(project))
  }

  function onHandleConfirm() {
    project.is_wait = false
    Fetch.post(['project', project.id], project).then(() => onConfirm(project))
  }

  function onHandlePaid() {
    project.is_paid = !project.is_paid
    Fetch.post(['project', project.id], project).then(() => onPaid(project))
  }

  const PaidButton = (
    <IconButton edge="end" disabled={transparent} onClick={() => {
      if (project.date_end < newDate().format()) {
        setTransparent(true)
        onHandlePaid()
      }
      else onHandlePaid()
    }}>
      {transparent ? <CheckBox/> : <CheckBoxOutlineBlank/>}
    </IconButton>
  )

  const DeleteButton = (
    <IconButton edge="end" disabled={transparent} onClick={() => {
      const text = project.user === project.creator || project.canceled ? "Удалить проект?" : (project.user === localStorage.User ? "Отказаться от проекта?" : "Отменить проект?")
      // eslint-disable-next-line no-restricted-globals
      if (!confirm(text)) return
      setTransparent(true)
      onHandleDelete()
    }}>
      {project.user === project.creator || project.canceled ? <DeleteIcon/> : <Cancel/>}
    </IconButton>
  )

  const ConfirmMenu = (
    <PopoverButtonsBlock
      icon={project.user === project.creator
        ? <MoreHoriz/>
        : <IconBadge dot content><Help color={'secondary'}/></IconBadge>
      }
    >
      {DeleteButton}
      <IconButton onClick={onHandleConfirm} disabled={transparent}>
        <AssignmentTurnedIn/>
      </IconButton>
    </PopoverButtonsBlock>
  )

  let action = null
  if (confirmButton && project.is_wait && !project.canceled) action = ConfirmMenu
  else if (paidButton && !project.is_paid && !project.canceled) action = PaidButton
  else if (deleteButton) action = DeleteButton
  const projectTitle = project.title || (formatDate(project.date_start) + (project.date_end === project.date_start ? '' : ` - ${formatDate(project.date_end)}`))
  const title = !child && project.parent_name ? project.parent_name + ' / ' + projectTitle : projectTitle

  return (
    <ProjectItemBase
      project={project}
      child={child}
      primary={title}
      action={action}
      deleting={transparent}
      onTouchHold={onTouchHold}
      onTouchEnd={onTouchEnd}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    />
  )
}

ProjectItem.defaultProps = {
  onPaid: () => {},
  onDelete: () => {},
  onConfirm: () => {},
  confirmButton: true,
  paidButton: true,
  deleteButton: true,
}

export function ProjectItemBase({project, deleting, child, onTouchHold, onTouchEnd, onMouseOver, onMouseLeave, onClick, primary, secondary, action}) {
  const mobile = useMobile()

  const past = project.date_end < newDate().format() || project.canceled
  const className = 'project-item' + (past ? ' past' : '') + (child ? ' child' : '') + (deleting ? ' deleting' : '')
  const touchActions = useTouchHold(() => onTouchHold(project), () => onTouchEnd(project))

  let clientName = null
  if (project.user !== project.creator) {
    clientName = (
      <>
        {localStorage.User === project.creator
          ? <><DoubleArrow fontSize={"inherit"} style={{paddingRight: 4}}/>{project.user_info.full_name}</>
          : <><Person fontSize={"inherit"} style={{paddingRight: 4}}/>{project.creator_info.full_name}</>
        }
      </>
    )
  }
  else if (project.client) clientName = mobile ? project.client.name : project.client.fullname

  let primaryText = primary || project.title
  if (!project.confirmed && project.creator === localStorage.User) primaryText += ' (Ожидание ответа)'
  else if (project.canceled === project.creator) primaryText += ' (Отменен)'
  else if (project.canceled === project.user) primaryText += ' (Отказ)'

  return (
    <ListItem
      className={className}
      onMouseOver={() => onMouseOver(project)}
      onMouseLeave={() => onMouseLeave(project)}
      button
      onClick={deleting ? undefined : () => onClick(project)}
      {...touchActions}
    >
      <ListItemText
        primaryTypographyProps={{className: 'project-item-text'}}
        primary={primaryText}
        secondaryTypographyProps={{className: 'project-item-text'}}
        secondary={secondary || clientName}
      />
      {(project.money === 0 || !!project.money) &&
      <ListItemText
        secondary={new Intl.NumberFormat('ru-RU').format(project.money) + " ₽"}
        style={{textAlign: "right", whiteSpace: "nowrap"}}/>
      }
      {!!action &&
      <ListItemSecondaryAction className={className + ' button'}>
        {action}
      </ListItemSecondaryAction>
      }
    </ListItem>
  )
}

ProjectItemBase.defaultProps = {
  onClick: () => {},
  onTouchHold: () => {},
  onTouchEnd: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
}

export default ProjectItemBase
