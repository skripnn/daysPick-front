import React, {useEffect, useState} from "react";
import Calendar from '../components/Calendar';
import {inject, observer} from "mobx-react";
import {List, ListSubheader} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import PositionTags from "../components/PositionTags/PositionTags";
import Fetch from "../js/Fetch";


function UserPage(props) {
  const [pick, setPick] = useState([])
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())
  const {userPage, user, projects, calendar, getUser, delProject, getProject} = props.UserStore
  const [Info, setInfo] = useState(null);

  useEffect(() => {
    if (user.username) getUser()
    // eslint-disable-next-line
  }, [props.UserStore])

  const content = {
    days: calendar.days,
    daysOff: userPage.edit ? [] : calendar.daysOff,
    daysPick: userPage.edit ? calendar.daysOff : pick
  }

  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setInfo(<PopOverDay
      anchorEl={element}
      info={info}
      dayOff={user.username === localStorage.User && dayOff}
      onClose={() => setInfo(null)}
      onClick={popoverLink}
    />)
  }

  function onChange(daysPick, date) {
    Fetch.post('daysoff', date.format()).then()
    calendar.setValue({daysOff: new Set(daysPick)})
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  function popoverLink(project) {
    const p = getProject(project.id)
    p ? props.setProject(p) : props.default({id: project.id, hidden: true})
    props.history.push(`/project/${project.id}/`)
  }

  function del(project) {
    delProject(project.id)
    Fetch.delete(['project', project.id]).then(() => {
      delProject(project.id)
      setTriggerGet(new Date().getTime())
    })
  }

  function paidToggle(project) {
    project.is_paid = !project.is_paid
    Fetch.post('project', project).then(getUser)
  }

  if (userPage.loading) return <></>

  return (
    <div>
      <Calendar
        triggerGet={triggerGet}
        triggerNew={user.username}
        content={content}
        setContent={calendar.setContent}
        get={(start, end) => Fetch.getCalendar(start, end, user.username)}
        offset={false}
        edit={userPage.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
      />
      {userPage.profile ?
        <PositionTags positions={user.positions}/>
        :
        <List dense>
          <ListSubheader disableSticky style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.7)"
          }}>{`Акутальные проекты${!projects.length ? ' отсутствуют' : ''}`}</ListSubheader>
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