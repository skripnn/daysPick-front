import React, {useState} from "react";
import Calendar from '../components/test/components/Calendar';
import {inject, observer} from "mobx-react";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import Fetch from "../js/Fetch";
import Info from "../js/Info";
import UserProfile from "../components/UserProfile/UserProfile";
import {useMobile} from "../components/hooks";
import ActualProjects from "../components/ActualProjects/ActualProjects";

function UserPage(props) {
  const {userPage, user, calendar, offersCalendar} = props.UserStore
  const {edit, daysPick, activeProjectTab} = props.UserStore.userPage
  const [DayInfo, setDayInfo] = useState(null);

  const content = activeProjectTab === 'Projects' ? {
    days: calendar.days,
    daysOff: edit ? [] : calendar.daysOff,
    daysPick: edit ? calendar.daysOff : daysPick
  } : {
    days: offersCalendar.days,
    daysOff: [],
    daysPick: daysPick
  }

  function getCalendar(start, end) {
    if (activeProjectTab === 'Projects') return Fetch.getCalendar(start, end, user.username)
    return Fetch.getOffersCalendar(start, end)
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

  function popoverLink(project) {
    Fetch.autoLink(`/project/${project.id}/`)
  }

  const mobile = useMobile()

  if (userPage.loading) return <></>

  return (
    <div>
      <Calendar
        triggerGet={userPage.lastCalendarUpdate}
        triggerNew={user.username}
        content={content}
        setContent={activeProjectTab === 'Projects' ? calendar.setContent : offersCalendar.setContent}
        get={getCalendar}
        noOffset={true}
        edit={userPage.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      {userPage.profile
        ? <UserProfile user={user} mobile={mobile}/>
        : <ActualProjects user={user}/>
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
