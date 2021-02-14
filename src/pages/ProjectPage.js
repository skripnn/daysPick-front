import React, {useEffect, useState} from "react";
import {getProject} from "../js/fetch/project";
import {getCalendar} from "../js/fetch/calendar";
import Calendar from "../components/Calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {inject, observer} from "mobx-react";
import {getProjectId} from "../js/functions/functions";
import PopOverDay from "../components/PopOverDay/PopOverDay";

function ProjectPage(props) {
  const {id, user, setDays, dates, setProject, hidden} = props.project
  useEffect(() => {
    if (id) getProject(id).then(setProject)
  // eslint-disable-next-line
  },[])

  const [Info, setInfo] = useState(null)

  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setInfo(<PopOverDay
      anchorEl={element}
      info={info}
      dayOff={localStorage.User === user && dayOff}
      onClose={() => setInfo(null)}
    />)
  }

  if (hidden) return null
  return (
    <div className={'project-block'}>
      <Calendar
        trigger={id}
        edit={true}
        get={(start, end) => getCalendar(start, end, user, id)}
        onChange={(daysPick, date) => setDays(daysPick, date)}
        content={{
          ...props.calendar,
          daysPick: dates
        }}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
      />
      <ProjectForm />
      {Info}
    </div>
  )
}

export default inject(stores => {
  const id = getProjectId()
  if (stores.ProjectStore.id !== id) stores.ProjectStore.default({id: id, hidden: !!id})
  const calendar = {}
  if (stores.ProjectStore.user) {
    const userCalendar = stores.UsersStore.getUser(stores.ProjectStore.user).calendar
    calendar.days = JSON.parse(JSON.stringify(userCalendar.days))
    calendar.daysOff = JSON.parse(JSON.stringify(userCalendar.daysOff))
  }
  return {
    project: stores.ProjectStore,
    calendar: calendar
  }
})(observer(ProjectPage))