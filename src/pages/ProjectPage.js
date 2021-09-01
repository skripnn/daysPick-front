import React, {useEffect, useState} from "react";
import Calendar from "../components/test/components/Calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {inject, observer} from "mobx-react";
import {getProjectId} from "../js/functions/functions";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import Fetch from "../js/Fetch";
import Info from "../js/Info"
import {List} from "@material-ui/core";
import {ProjectItem} from "../components/ProjectItem/ProjectItem";

function ProjectPage(props) {
  const {id, user, setDays, dates, setProject, hidden, creator, children, is_folder} = props.project
  // const [content, setContent] = useState({...props.calendar})
  const [pick, setPick] = useState(null)
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())

  function getProject(id) {
    if (id) {
      Fetch.get(['project', id]).then(project => {
        setPick(null)
        if (Object.keys(project).includes('error')) Fetch.autoLink('/')
        else setProject(project)
      })
    }
  }

  // eslint-disable-next-line
  useEffect(() => getProject(id),[id])
  useEffect(() => setTriggerGet(new Date().getTime()), [user, children])


  const [DayInfo, setDayInfo] = useState(null)

  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(<PopOverDay
      anchorEl={element}
      info={info}
      dayOff={localStorage.User === user && dayOff}
      onClose={() => setDayInfo(null)}
    />)
  }
  console.log(user)
  if (!localStorage.User) Fetch.autoLink('/')
  if (hidden) return null
  return (
    <div className={'project-block'}>
      <Calendar
        trigger={id}
        triggerClear={user}
        triggerGet={triggerGet}
        triggerNew={id}
        edit={!is_folder && creator === localStorage.User}
        get={user ? (start, end) => Fetch.getCalendar(start, end, user, id) : undefined}
        onChange={setDays}
        content={{
          ...props.content,
          daysPick: pick || dates
        }}
        // setContent={setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      {is_folder && <List dense>
        {children.map(project =>
          <ProjectItem
            child
            project={project}
            key={project.id}

            onClick={p => Fetch.autoLink(`/project/${p.id}/`)}
            onDelete={() => getProject(id)}
            paidButton={false}
            confirmButton={false}

            onTouchHold={p => setPick(Object.keys(p.days))}
            onTouchEnd={() => setPick(null)}
            onMouseOver={p => setPick(Object.keys(p.days))}
            onMouseLeave={() => setPick(null)}
          />
        )}
      </List>}
      <ProjectForm />
      {DayInfo}
    </div>
  )
}

export default inject(stores => {
  const id = getProjectId()
  if (id && stores.ProjectStore.id !== id) stores.ProjectStore.default({id: id, hidden: !!id})
  const calendar = {
    days: {},
    daysOff: []
  }
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
