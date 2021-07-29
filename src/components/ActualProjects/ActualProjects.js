import HeaderText from "../Text/HeaderText";
import {ProjectItemAutoFolder} from "../ProjectItem/ProjectItem";
import React from "react";
import {inject, observer} from "mobx-react";
import Fetch from "../../js/Fetch";
import Tabs from "../Tabs/Tabs";
import {List} from "@material-ui/core";
import {toJS} from "mobx";

function ActualProjects({user, ...props}) {
  const {projects, offers, getActualProjects, getActualOffers} = props.UserStore
  const {setValue, updateCalendar, activeProjectTab} = props.UserStore.userPage

  function highlightDays(project) {
    setValue({daysPick: Object.keys(project.days)})
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
    Fetch.autoLink(`/project/${project.id}/`)
  }

  const renderer = (project) => (
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

      onTouchHold={highlightDays}
      onTouchEnd={unHighlightDays}
      onMouseOver={highlightDays}
      onMouseLeave={unHighlightDays}
    />
  )

  const renderChoice = (list, label) => {
    if (list && list.length) return list.map(renderer)
    return <HeaderText center>{label + ' отсутствуют'}</HeaderText>
  }

  console.log(toJS(projects))

  if (user.username !== localStorage.User) {
    return (
      <List dense>
        <HeaderText center>{`Актуальные проекты ${!projects || !projects.length ? ' отсутствуют' : ''}`}</HeaderText>
        {!!projects && !!projects.length && projects.map(renderer)}
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
          content: renderChoice(projects, 'Актуальные проекты')
        },
        {
          id: 'Offers',
          label: 'Мои офферы',
          content: renderChoice(offers, 'Актуальные офферы')
        }
      ]}
    </Tabs>
  )

}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser()
}))(observer(ActualProjects))

