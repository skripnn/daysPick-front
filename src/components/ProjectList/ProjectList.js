import React, {useEffect} from "react";
import {checkUser, getUser, noArchiveProjects} from "../../js/functions/functions";
import {deleteProject, getProjects} from "../../js/fetch/project";
import './ProjectList.css'
import {inject, observer} from "mobx-react";
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {newDate} from "../../js/functions/date";


function ProjectsList(props) {
  useEffect(get, [])

  // if (checkUser()) return null


  function get() {
    getProjects(props.user).then((result) => props.setProjects(result))
  }

  function del(id) {
    deleteProject(id).then(get)
  }

  function link(id) {
    props.history.push(`/project/${id}/`)
  }

  function ProjectItem(props) {
    let className = 'project-item'
    if (props.date_end < newDate().format()) className += " past"

    return (
      <ListItem
        button
        onClick={() => link(props.id)}
        className={className}
      >
        <ListItemText primary={props.title} secondary={props.client? props.client.name : null}/>
        <ListItemText secondary={new Intl.NumberFormat('ru-RU').format(props.money) + " ₽"} style={{textAlign: "right"}}/>
        <ListItemSecondaryAction className={className}>
          <IconButton edge="end" onClick={() => del(props.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }

  const visibleProjects = props.actual? noArchiveProjects(props.projects) : props.projects
  const style = {textAlign: "center", color: "rgba(0, 0, 0, 0.7)"}
  const title = props.actual? "Актуальные проекты" : "Мои проекты"

  return (
      <List dense>
        <ListSubheader disableSticky style={style}>{title}</ListSubheader>
        {visibleProjects.map(i => <ProjectItem {...i} key={i.id}/>)}
      </List>
  )
}

export default inject(stores => {
  const user = getUser() || localStorage.User
  return {
    user: user,
    projects: stores.UsersStore.getUser(user).projects,
    setProjects: stores.UsersStore.getUser(user).setProjects,
    ...stores.UsersStore.getUser(user).userPage,
    setValue: stores.UsersStore.getUser(user).setValue,
    setDaysPick: stores.UsersStore.getUser(user).setDaysPick
  }
})(observer(ProjectsList))
