import React, {useEffect, useState} from "react";
import Calendar from '../components/Calendar';
import UserProfile from "../components/UserProfile/UserProfile";
import {postDaysOff} from "../js/fetch/daysOff";
import {getCalendar} from "../js/fetch/calendar";
import {inject, observer} from "mobx-react";
import {deleteProject, postProject} from "../js/fetch/project";
import {List, ListItem, ListItemIcon, ListItemText, ListSubheader, Popover} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import {EventBusy} from "@material-ui/icons";


function UserPage(props) {
  const [pick, setPick] = useState([])
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())
  const {userPage, user, projects, calendar, getUser, delProject, getProject} = props.UserStore
  const [Info, setInfo] = useState(null);

  useEffect(() => {
    if (user.username) getUser()
  // eslint-disable-next-line
  }, [user.username])

  const content = {
    days: calendar.days,
    daysOff: userPage.edit? [] : calendar.daysOff,
    daysPick: userPage.edit? calendar.daysOff : pick
  }

  function showInfo(element, info, date) {
    const dayOff = calendar.daysOff.has(date.format())
    if (!info && !dayOff) return
    if (!info) info = []
    setInfo(<Popover
      open
      anchorEl={element}
      onClose={() => setInfo(null)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      style={{borderRadius: 4}}
    >
      <List dense disablePadding>
        {dayOff &&
          <ListItem divider>
            <ListItemIcon style={{minWidth: "unset", paddingRight: 4}}>
              <EventBusy fontSize={"small"}/>
            </ListItemIcon>
            <ListItemText secondary={"Выходной"}/>
          </ListItem>
        }
        {info.map(i =>
          <ListItem key={i.project.id} divider button>
            <ListItemText
              primary={i.project.title}
              secondary={i.info}
              secondaryTypographyProps={{style: {whiteSpace: "pre-line"}}}
              onClick={() => popoverLink(i.project.id)}
            />
          </ListItem>
        )}
      </List>
    </Popover>)
  }

  function onChange(daysPick, date) {
    postDaysOff(date.format()).then()
    calendar.setValue({daysOff: new Set(daysPick)})
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  function popoverLink(id) {
    const project = getProject(id)
    project ?  props.setProject(project) : props.default({id: id, hidden: true})
    props.history.push(`/project/${id}/`)
  }

  function del(project) {
    delProject(project.id)
    deleteProject(project.id).then(() => {
      delProject(project.id)
      setTriggerGet(new Date().getTime())
    })
  }

  function paidToggle(project) {
    project.is_paid = !project.is_paid
    postProject(project).then(getUser)
  }

  if (userPage.loading) return <></>

  return (
    <div>
      <Calendar
        triggerGet={triggerGet}
        triggerNew={user.username}
        content={content}
        setContent={calendar.setContent}
        get={(start, end) => getCalendar(start, end, user.username)}
        offset={false}
        edit={userPage.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
      />
      {userPage.profile?
        <UserProfile user={user}/>
        :
        <List dense>
          <ListSubheader disableSticky style={{textAlign: "center", color: "rgba(0, 0, 0, 0.7)"}}>{"Акутальные проекты"}</ListSubheader>
          {projects.map(project => <ProjectItem
            project={project}
            key={project.id}

            onClick={link}
            onDelete={del}
            paidToggle={paidToggle}

            onTouchHold={() => setPick(Object.keys(project.days))}
            onTouchEnd={() => setPick([])}
            onMouseOver={() => setPick(Object.keys(project.days))}
            onMouseLeave={() => setPick([])}
          />)}
        </List>
      }
      {Info}
    </div>
  )
}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser(),
  setProject: stores.ProjectStore.setProject,
  default: stores.ProjectStore.default
}))(observer(UserPage))