import React, {useState} from "react";
import Calendar from '../components/test/components/Calendar';
import {inject, observer} from "mobx-react";
import {
  List,
  ListSubheader
} from "@material-ui/core";
import {ProjectItemAutoFolder} from "../components/ProjectItem/ProjectItem";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import Fetch from "../js/Fetch";
import Info from "../js/Info";
import UserProfile from "../components/UserProfile/UserProfile";

function UserPage(props) {
  const [pick, setPick] = useState([])
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())
  const {userPage, user, projects, calendar, getProject, getActualProjects} = props.UserStore
  const [DayInfo, setDayInfo] = useState(null);

  const content = {
    days: calendar.days,
    daysOff: userPage.edit ? [] : calendar.daysOff,
    daysPick: userPage.edit ? calendar.daysOff : pick
  }

  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(<PopOverDay
      anchorEl={element}
      info={info}
      dayOff={user.username === localStorage.User && dayOff}
      onClose={() => setDayInfo(null)}
      onClick={popoverLink}
    />)
  }

  function onChange(daysPick, array, pick) {
    Fetch.post('daysoff', {days: array, pick: pick}).then()
    calendar.setValue({daysOff: new Set(daysPick)})
  }

  function link(project) {
    Fetch.autoLink(`/project/${project.id}/`)
  }

  function popoverLink(project) {
    const p = getProject(project.id)
    p ? props.setProject(p) : props.default({id: project.id, hidden: true})
    props.history.push(`/project/${project.id}/`)
  }

  function onAction() {
    getActualProjects()
    setTriggerGet(new Date().getTime())
    calendar.setValue({daysPick: new Set([])})
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
        noOffset={true}
        edit={userPage.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      {userPage.profile ? <UserProfile user={user} />
        :
        <List dense>
          <ListSubheader disableSticky className={'no-select'} style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.7)"
          }}>{`Акутальные проекты${!projects.length ? ' отсутствуют' : ''}`}</ListSubheader>
          {projects.map(project =>
            <ProjectItemAutoFolder
              project={project}
              key={project.id}

              onClick={link}
              onDelete={onAction}
              onPaid={onAction}
              onConfirm={onAction}
              paidButton={project.user === localStorage.User}
              confirmButton={project.user === localStorage.User}
              childListFilter={l => l.slice(0).reverse()}

              onTouchHold={(p) => setPick(Object.keys(p.days))}
              onTouchEnd={() => setPick([])}
              onMouseOver={(p) => setPick(Object.keys(p.days))}
              onMouseLeave={() => setPick([])}
            />
          )}
        </List>
      }
      {DayInfo}
    </div>
  )
}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser(),
  setProject: stores.ProjectStore.setProject,
  default: stores.ProjectStore.default
}))(observer(UserPage))
