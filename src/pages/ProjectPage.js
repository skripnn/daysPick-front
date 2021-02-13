import React, {useEffect} from "react";
import {getProject} from "../js/fetch/project";
import {getCalendar} from "../js/fetch/calendar";
import Calendar from "../components/Calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {inject, observer} from "mobx-react";
import {getProjectId} from "../js/functions/functions";

function ProjectPage(props) {
  const { project, calendar } = props
  useEffect(() => {
    if (project.id) getProject(project.id).then(project.setProject)
  // eslint-disable-next-line
  },[])

  if (project.hidden) return null
  return (
    <div className={'project-block'}>
      <Calendar
        trigger={project.id}
        edit={true}
        get={(start, end) => getCalendar(start, end, project.user, project.id)}
        onChange={(daysPick, date) => project.setDays(daysPick, date)}
        content={{
          ...calendar,
          daysPick: project.dates
        }}
      />
      <ProjectForm />
    </div>
  )
}

export default inject(stores => {
  const id = getProjectId()
  if (stores.ProjectStore.id !== id) stores.ProjectStore.default({id: id, hidden: !id})
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