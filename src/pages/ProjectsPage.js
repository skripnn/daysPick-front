import React, {useEffect} from "react";
import {deleteProject, getProjects} from "../js/fetch/project";
import {inject, observer} from "mobx-react";
import ProjectsList from "../components/ProjectList/ProjectList";
import {LocalUser} from "../js/functions/functions";


function ProjectsPage(props) {
  const user = LocalUser()
  const {projects, setProjects, delProject} = props.pageStore

  useEffect(get, [])

  function get() {
    getProjects(user).then(setProjects)
  }

  function del(id) {
    deleteProject(id).then(() => delProject(id))
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  return (
    <>
      <ProjectsList
        projects={projects}
        onClick={link}
        onDelete={del}
      />
    </>
  )
}

export default inject(stores => ({
    pageStore: stores.ProjectsPageStore,
    setProject: stores.ProjectStore.setValue
}))(observer(ProjectsPage))