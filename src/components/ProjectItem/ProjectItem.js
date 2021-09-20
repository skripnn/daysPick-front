import {newDate} from "../../js/functions/date";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useState} from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  AssignmentTurnedIn, Cancel,
  CheckBoxOutlineBlank, DoubleArrow,
  FolderOpen, Help, MoreHoriz, Person,
} from "@material-ui/icons";
import "./ProjectItem.css"
import Fetch from "../../js/Fetch";
import {compareId, formatDate, getProjectStatus} from "../../js/functions/functions";
import PopoverButtonsBlock from "../PopoverButtonsBlock/PopoverButtonsBlock";
import {useTouchHold} from "../hooks";
import IconBadge from "../IconBadge/IconBadge";
import FetchIconButton from "../core/FetchIconButton";
import {useAccount} from "../../stores/storeHooks";
import Info from "../../js/Info";
import mainStore from "../../stores/mainStore";
import Item from "../Items/Item";


export function ProjectItemAutoFolder({project, wrapperRender,
                               onTouchHold, onTouchEnd, onMouseOver, onMouseLeave,
                               onClick, onPaid, onDelete, onConfirm,
                               confirmButton, paidButton, deleteButton}) {

  const commonProps = {
    onTouchHold: onTouchHold,
    onTouchEnd: onTouchEnd,
    onMouseOver: onMouseOver,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    onPaid: onPaid,
    onDelete: onDelete,
    onConfirm: onConfirm,
    deleteButton: deleteButton,
    paidButton: paidButton,
    confirmButton: confirmButton,
    wrapperRender: wrapperRender
  }

  const Folder = (
    <ProjectFolderItem
      project={project}
      {...commonProps}
      renderChild={p => (
        <ProjectItem
          child
          key={p.id.toString()}
          project={p}
          {...commonProps}
        />
      )}
    />
  )

  const Item = (
    <ProjectItem
      key={project.id.toString()}
      project={project}
      {...commonProps}
    />
  )

  return project.is_series ? Folder : Item
}


export function ProjectFolderItem({project, wrapperRender, renderChild,
                                    onTouchHold, onTouchEnd, onMouseOver, onMouseLeave,
                                    onClick}) {

  const [folderOpen, setFolderOpen] = useState(false)
  const account = useAccount()
  const type = compareId(project.user, project.creator) ? 'self' :
    compareId(project.user, account) ? 'in' : 'out'

  let clients = [...new Set(project.children.map(p => p.client ? p.client.full_name : null))]
  if (clients.includes(null)) clients = clients.filter(v => !!v).concat([null])
  const client = clients.length > 1 ? clients[0] + ', ...' : clients[0]

  const money = project.children.length ? project.children.map(p => p.money || 0).reduce((a, b) => a + b, 0) : null

  const action = (
    <IconButton edge="end" onClick={() => setFolderOpen(!folderOpen)} size={'small'} disabled={!project.children.length}>
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
      secondary={type === 'self' && (client || '...')}
      action={action}
      onTouchHold={onTouchHold}
      onTouchEnd={onTouchEnd}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      wrapperRender={wrapperRender}
    />
    {folderOpen && project.children.map(renderChild)}
  </>)

}


export function ProjectItem({project, wrapperRender, child,
                              onTouchHold, onTouchEnd, onMouseOver, onMouseLeave,
                              onClick, onConfirm, onPaid, onDelete,
                              confirmButton, paidButton, deleteButton}) {
  const past = project.date_end < newDate().format()
  const account = useAccount()
  const type = compareId(project.user, project.creator) ? 'self' :
    compareId(project.user, account) ? 'in' : 'out'

  const PaidButton = (
    <FetchIconButton
      edge={'end'}
      fetch={() => Fetch
        .post(['project', project.id], {is_paid: true})
        .then((r) => {
          if (r.error) Info.error(r.error)
          else {
            Info.success('Проект оплачен')
            onPaid(r)
          }
        })}
    >
      <CheckBoxOutlineBlank/>
    </FetchIconButton>
  )

  const DeleteButton = (
    <FetchIconButton
      edge={'end'}
      confirmText={type === 'self' || project.canceled ?
        "Удалить проект?" :
        (type === 'in' ?
          "Отказаться от проекта?" :
          "Отменить проект?")}
      fetch={() => Fetch
          .delete(['project', project.id])
          .then((r) => {
            if (r.error) Info.error(r.error)
            else {
              Info.success(type === 'out' ? 'Проект отменён' : 'Проект удалён')
              if (type === 'in') Fetch.get('account').then(mainStore.Account.setValue)
              onDelete(project)
            }
          })}
      >
      {type === 'self' || project.canceled ? <DeleteIcon/> : <Cancel/>}
    </FetchIconButton>
  )

  const ConfirmMenu = (
    <PopoverButtonsBlock
      icon={type === 'self'
        ? <MoreHoriz/>
        : <IconBadge dot content><Help color={'secondary'}/></IconBadge>
      }
    >
      {DeleteButton}
      <FetchIconButton
        edge={false}
        fetch={() => Fetch
          .post(['project', project.id], {confirmed: true, is_wait: false})
          .then((r) => {
            if (r.error) Info.error(r.error)
            else {
              Info.success('Проект подтверждён')
              Fetch.get('account').then(mainStore.Account.setValue)
              onConfirm(r)
            }
          })}
      >
        <AssignmentTurnedIn/>
      </FetchIconButton>
    </PopoverButtonsBlock>
  )

  let action = null
  if (confirmButton && !project.confirmed && !project.canceled) action = ConfirmMenu
  else if (paidButton && past && !project.is_paid && !project.canceled) action = PaidButton
  else if (deleteButton) action = DeleteButton
  const projectTitle = project.title || (formatDate(project.date_start) + (project.date_end === project.date_start ? '' : ` - ${formatDate(project.date_end)}`))
  const title = !child && project.parent && project.parent.title ? project.parent.title + ' / ' + projectTitle : projectTitle

  return (
    <ProjectItemBase
      type={type}
      project={project}
      child={child}
      primary={title}
      action={action}
      onTouchHold={onTouchHold}
      onTouchEnd={onTouchEnd}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      wrapperRender={wrapperRender}
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

export function ProjectItemBase({project, child, wrapperRender,
                                  onTouchHold, onTouchEnd, onMouseOver, onMouseLeave,
                                  onClick, primary, secondary, action, type}) {

  const past = project.date_end < newDate().format() || project.canceled
  const className = 'project-item' + (past ? ' past' : '') + (child ? ' child' : '')
  const touchActions = useTouchHold(() => onTouchHold(project), () => onTouchEnd(project))

  let clientName
  if (type !== 'self') {
    clientName = (
      <>
        {type === 'in'
          ? <><Person fontSize={"inherit"} style={{paddingRight: 4}}/>{project.creator.full_name}</>
          : <><DoubleArrow fontSize={"inherit"} style={{paddingRight: 4}}/>{project.user ? project.user.full_name : '...'}</>
        }
      </>
    )
  }
  else clientName = project.client ? project.client.full_name : '...'

  let primaryText = primary || project.title
  if (typeof primaryText === 'string') {
    const status = getProjectStatus(project)
    if (status) primaryText += ` (${status})`
  }

  const item = (<>
    <Item
      className={className}
      onMouseOver={() => onMouseOver(project)}
      onMouseLeave={() => onMouseLeave(project)}
      onClick={() => onClick(project)}
      {...touchActions}

      primary={primaryText}
      secondary={secondary || clientName}
      third={(project.money === 0 || !!project.money) && new Intl.NumberFormat('ru-RU').format(project.money) + " ₽"}
      action={action}
    />
  </>)

  return wrapperRender? React.cloneElement(wrapperRender(project), {children: item}) : item
}

ProjectItemBase.defaultProps = {
  onClick: () => {},
  onTouchHold: () => {},
  onTouchEnd: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
}

export default ProjectItemBase
