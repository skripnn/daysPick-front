import React, {useEffect, useState} from "react";
import Calendar from '../components/Calendar';
import ProjectsList from "../components/ProjectList/ProjectList";
import UserProfile from "../components/UserProfile/UserProfile";
import {postDaysOff} from "../js/fetch/daysOff";
import {getCalendar} from "../js/fetch/calendar";
import {inject, observer} from "mobx-react";
import {deleteProject, postProject} from "../js/fetch/project";



function UserPage(props) {
  const [pick, setPick] = useState([])
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())
  const {userPage, user, projects, calendar, getUser, delProject} = props.UserStore

  useEffect(() => {
    if (user.username) getUser()
  }, [user.username])

  const content = {
    days: calendar.days,
    daysOff: userPage.edit? [] : calendar.daysOff,
    daysPick: userPage.edit? calendar.daysOff : pick
  }

  function showInfo(info, date) {
  }

  function onChange(daysPick, date) {
    postDaysOff(date.format()).then()
    calendar.setValue({daysOff: daysPick})
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  function del(id) {
    delProject(id)
    deleteProject(id).then(() => delProject(id)).then(() => setTriggerGet(new Date().getTime()))
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
      <div hidden={userPage.profile}><ProjectsList
        history={props.history}
        projects={projects}
        onClick={link}
        onDelete={del}
        title={"Актуальные проекты"}
        onTouchHold={setPick}
        onTouchEnd={() => setPick([])}
        onMouseOver={setPick}
        onMouseLeave={() => setPick([])}
        paidToggle={paidToggle}
      /></div>
      <div hidden={!userPage.profile}><UserProfile user={user}/></div>
    </div>
  )
}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser(),
  setProject: stores.ProjectStore.setProject
}))(observer(UserPage))