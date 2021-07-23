import React from "react";
import {inject, observer} from "mobx-react";
import {ProjectItemAutoFolder} from "../components/ProjectItem/ProjectItem";
import Fetch from "../js/Fetch";
import LazyList from "../components/LazyList/LazyList";


function ProjectsPage(props) {
  const {f, p, setProject} = props

  function onAction(project) {
    if (project.parent) {
      const parent = props.pageStore.getProject(project.parent.id)
      parent.children = parent.children.filter(p => p.id !== project.id)
      if (parent.children.length) props.pageStore.setProject(parent)
      else props.pageStore.delProject(parent.id)
    }
    else props.pageStore.delProject(project.id)
  }

  function link(project) {
    Fetch.link(`project/${project.id}`, setProject)
  }

  return (
    <div>
      <LazyList
        searchFieldParams={{
          set: f.set,
          calendar: props.calendar,
          user: localStorage.User
        }}
        getLink={'projects'}
        getParams={{user: localStorage.User}}
        pages={f.pages || p.pages}
        page={f.page || p.page}
        set={p.set}
        add={f.pages ? f.add : p.add}
      >
        {(f.exist() ? f.list : p.list).map((project) =>
          <ProjectItemAutoFolder
            project={project}
            key={project.id}
            onClick={link}
            onDelete={onAction}
            confirmButton={false}
            paidButton={false}
          />
        )}
      </LazyList>
    </div>
  )
}

export default inject(stores => ({
    f: stores.ProjectsPageStore.f,
    p: stores.ProjectsPageStore.p,
    pageStore: stores.ProjectsPageStore,
    setProject: stores.ProjectStore.setProject,
    calendar: stores.UsersStore.getLocalUser().calendar
}))(observer(ProjectsPage))
