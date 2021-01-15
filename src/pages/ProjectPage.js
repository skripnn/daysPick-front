import React, {useEffect} from "react";
import {getProject} from "../js/fetch/project";
import {getCalendar} from "../js/fetch/calendar";
import Calendar from "../components/Calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {inject, observer} from "mobx-react";
import {getProjectId} from "../js/functions/functions";

function ProjectPage(props) {
  useEffect(() => {
    if (props.project.id) getProject(props.project.id).then((project) => props.project.setValue(project))
  // eslint-disable-next-line
  },[])

  if (props.loading) return <></>
  return (
    <div className={'project-block'}>
      <Calendar
        edit={true}
        get={(start, end) => getCalendar(start, end, localStorage.User, props.project.id)}
        onChange={(days) => props.project.setValue({dates: days})}
        content={{
          ...props.init,
          daysPick: props.project.dates
        }}
      />
      <ProjectForm
        {...props.project}
        onChange={(field) => props.project.setValue(field)}
      />
    </div>
  )
}

export default inject(stores => {
  const id = getProjectId()
  const project = stores.UsersStore.getUser(localStorage.User).getProject(id) || stores.ProjectStore.default
  if (stores.ProjectStore.id !== id) stores.ProjectStore.setValue({...project, id: id})
  return {
    loading: stores.ProjectStore.id && !stores.ProjectStore.dates.length,
    project: stores.ProjectStore,
    init: {
      days: JSON.parse(JSON.stringify(stores.UsersStore.getUser(localStorage.User).calendar.content.days)),
      daysOff: [...stores.UsersStore.getUser(localStorage.User).calendar.content.daysOff],
    }
  }
})(observer(ProjectPage))