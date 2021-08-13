import HeaderText from "../Text/HeaderText";
import {ProjectItemAutoFolder} from "../ProjectItem/ProjectItem";
import React from "react";
import {inject, observer} from "mobx-react";
import Fetch from "../../js/Fetch";
import Tabs from "../Tabs/Tabs";
import {List} from "@material-ui/core";
import {compareProfiles} from "../../js/functions/functions";

function ActualProjects({user, ...props}) {
  const {projects, offers, getActualProjects, getActualOffers} = props.UserStore
  const {setValue, updateCalendar, activeProjectTab} = props.UserStore.userPage

  function highlightDays(project) {
    setValue({daysPick: project.dates})
  }

  function unHighlightDays() {
    setValue({daysPick: []})
  }

  function onAction() {
    unHighlightDays()
    activeProjectTab === 'Projects' ? getActualProjects() : getActualOffers()
    updateCalendar()
  }

  function link(project) {
    unHighlightDays()
    Fetch.autoLink(`/project/${project.id}/`)
  }

  const render = list => list.map(project =>
    <ProjectItemAutoFolder
      project={project}
      key={project.id}

      onClick={link}
      onDelete={onAction}
      onPaid={onAction}
      onConfirm={onAction}
      paidButton={compareProfiles(project.user, localStorage.User)}
      confirmButton={compareProfiles(project.user, localStorage.User)}

      onTouchHold={highlightDays}
      onTouchEnd={unHighlightDays}
      onMouseOver={highlightDays}
      onMouseLeave={unHighlightDays}
    />
  )

  const renderChoice = (list) => {
    if (list && list.length) return render(list)
    return <HeaderText center>{'Актуальные проекты отсутствуют'}</HeaderText>
  }

  if (!compareProfiles(user, localStorage.User)) {
    return (
      <List dense>
        <HeaderText center>{`Актуальные проекты ${!projects || !projects.length ? ' отсутствуют' : ''}`}</HeaderText>
        {!!projects && !!projects.length && render(projects)}
      </List>
    )
  }

  return (
    <Tabs
      activeTab={activeProjectTab}
      setActiveTab={(v) => setValue({activeProjectTab: v, edit: false, lastCalendarUpdate: new Date().getTime()})}
    >
      {[
        {
          id: 'Projects',
          label: 'Мои проекты',
          content: renderChoice(projects)
        },
        {
          id: 'Offers',
          label: 'Исходящие проекты',
          content: renderChoice(offers)
        }
      ]}
    </Tabs>
  )

}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser()
}))(observer(ActualProjects))

