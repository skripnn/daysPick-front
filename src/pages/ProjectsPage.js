import React from "react";
import {inject, observer} from "mobx-react";
import {ProjectItemAutoFolder} from "../components/ProjectItem/ProjectItem";
import Fetch from "../js/Fetch";
import LazyList from "../components/LazyList/LazyList";
import {useMobile} from "../components/hooks";
import ProjectsStatistics from "../components/ProjectsStatistics/ProjectsStatistics";


function ProjectsListPage(props) {
  const {link, f, p, setProject, statistics, setValue} = props
  const mobile = useMobile()

  function onAction(project) {
    if (project.parent) {
      const parent = props.pageStore.getProject(project.parent.id)
      parent.children = parent.children.filter(p => p.id !== project.id)
      if (parent.children.length) props.pageStore.setProject(parent)
      else props.pageStore.delProject(parent.id)
    }
    else props.pageStore.delProject(project.id)
  }

  function onProjectClick(project) {
    Fetch.link(`${link}/${project.id}`, setProject)
  }

  function getStatistics(filter) {
    if (setValue) Fetch.post([link, 'statistics'], filter).then(v => setValue({statistics: v}))
  }

  return (
      <div>
        <LazyList
          searchFieldParams={{
            set: f.set,
            calendar: props.calendar,
            user: localStorage.User,
          }}
          getLink={link}
          getParams={{user: localStorage.User}}
          pages={f.pages || p.pages}
          page={f.page || p.page}
          set={p.set}
          add={f.pages ? f.add : p.add}
          onFilterChange={getStatistics}
        >
          {!!statistics && (f.exist() || p.exist()) && <ProjectsStatistics statistics={statistics} mobile={mobile}/>}
          {(f.exist() ? f.list : p.list).map((project) =>
            <ProjectItemAutoFolder
              project={project}
              key={project.id}
              onClick={onProjectClick}
              onDelete={onAction}
              confirmButton={project.creator !== localStorage.User}
              paidButton={false}
            />
          )}
        </LazyList>
      </div>
  )
}

export const ProjectsPage = inject(stores => ({
  f: stores.ProjectsPageStore.f,
  p: stores.ProjectsPageStore.p,
  pageStore: stores.ProjectsPageStore,
  setProject: stores.ProjectStore.setProject,
  calendar: stores.UsersStore.getLocalUser().calendar,
  statistics: stores.ProjectsPageStore.statistics,
  setValue: stores.ProjectsPageStore.setValue,
  link: 'projects'
}))(observer(ProjectsListPage))

export const OffersPage = inject(stores => ({
  f: stores.OffersPageStore.f,
  p: stores.OffersPageStore.p,
  pageStore: stores.OffersPageStore,
  setProject: stores.OffersPageStore.setProject,
  calendar: stores.UsersStore.getLocalUser().offersCalendar,
  link: 'offers'
}))(observer(ProjectsListPage))
