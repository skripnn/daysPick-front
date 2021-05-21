import TouchHold from "../../js/TouchHold";
import {newDate} from "../../js/functions/date";
import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Popover
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import React, {useRef, useState} from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  AssignmentTurnedIn,
  CheckBox,
  CheckBoxOutlineBlank,
  FolderOpen,
  MoreHoriz
} from "@material-ui/icons";
import "./ProjectItem.css"
import useMediaQuery from "@material-ui/core/useMediaQuery";

function ProjectItem(props) {
  let project = {...props.project}
  const isFolder = !!project.children && !!project.children.length
  // if (!!project.children && project.children.length === 1) project = {...project.children[0]}
  const [folderOpen, setFolderOpen] = useState(props.folderOpen)
  const onTouchHold = new TouchHold(() => props.onTouchHold(project), () => props.onTouchEnd(project))
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
        <AssignmentTurnedIn/>
      </IconButton>
    </ActionsMenu>
  )

  const parentAction = (
    <IconButton edge="end" onClick={() => setFolderOpen(!folderOpen)}>
      {folderOpen ? <ArrowDropUp/> : <ArrowDropDown/>}
    </IconButton>
  )

  let secondaryAction = null
  if (isFolder) secondaryAction = parentAction
  else if (props.confirmProject && project.is_wait) secondaryAction = confirmProject
  else if (props.paidToggle && props.onDelete) secondaryAction = past ? paidToggle : delProject
  else if (props.onDelete) secondaryAction = delProject
  else if (props.paidToggle) secondaryAction = paidToggle

  const mobile = useMediaQuery('(max-width:600px)')

  let childrenMoney = 0
  if (isFolder) project.children.forEach(p => childrenMoney += p.money)

  let client = '...'
  if (isFolder) {
    let clients = [...new Set(project.children.map(p => p.client ? (mobile ? p.client.name : p.client.fullname) : null))]
    if (clients.includes(null)) clients = clients.filter(v => !!v).concat([null])
    client = clients.length > 1 ? clients[0] + ', ...' : clients[0]
  }
  else if (project.client) client = mobile ? project.client.name : project.client.fullname

  const formatDate = (d) => {
    return d[8] + d[9] + '.' + d[5] + d[6] + '.' + d[2] + d[3]
  }

  const projectTitle = project.title || (formatDate(project.date_start) + (project.date_end === project.date_start ? '' : ` - ${formatDate(project.date_end)}`))
  const title = !props.child && project.parent_name ? project.parent_name + ' / ' + projectTitle : projectTitle

  return (<>
    <ListItem
      ContainerProps={props.child ? {className: 'project-item-child'} : undefined}
      className={className}
      onMouseOver={() => props.onMouseOver(project)}
      onMouseLeave={() => props.onMouseLeave(project)}
      button
      onClick={deleting ? undefined : () => props.onClick(project)}
      {...onTouchHold.actions}
    >
      <ListItemText primary={<div style={{display: 'flex', alignItems: 'center'}}>{isFolder &&
      <FolderOpen fontSize={"inherit"} style={{paddingRight: 4}}/>}{title}</div>}
                    secondary={client}/>
      {(project.money === 0 || !!project.money || isFolder) &&
      <ListItemText
        secondary={new Intl.NumberFormat('ru-RU').format(isFolder ? childrenMoney : project.money) + " ₽"}
        style={{textAlign: "right", whiteSpace: "nowrap"}}/>
      }
      {!!secondaryAction &&
      <ListItemSecondaryAction className={className + ' button'}>
        {secondaryAction}
      </ListItemSecondaryAction>
      }
    </ListItem>
    {isFolder && folderOpen && props.childListFunc(project.children).map(p => <ProjectItem
      {...props}
      child
      {...props.childProps}
      childProps={{}}
      project={p}
      key={p.id}
    />)}
  </>)
}

ProjectItem.defaultProps = {
  onTouchHold: () => {},
  onTouchEnd: () => {},
  onMouseOver: () => {},
  onMouseLeave: () => {},
  childProps: {},
  childListFunc: (l) => l
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