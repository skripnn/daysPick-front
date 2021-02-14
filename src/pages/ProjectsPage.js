import React, {useEffect} from "react";
import {deleteProject, getProjects} from "../js/fetch/project";
import {inject, observer} from "mobx-react";
import {LocalUser} from "../js/functions/functions";
import {List} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";


function ProjectsPage(props) {
  const user = LocalUser()
  const {projects, setProjects, delProject} = props.pageStore

  // eslint-disable-next-line
  useEffect(get, [])

  function get() {
    getProjects(user).then(setProjects)
  }

  function del(project) {
    deleteProject(project.id).then(() => delProject(project.id))
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  return (
    <List dense>
      {projects.map(project => <ProjectItem
        project={project}
        key={project.id}
        onClick={link}
        onDelete={del}
      />)}
    </List>
  )
}

export default inject(stores => ({
    pageStore: stores.ProjectsPageStore,
    setProject: stores.ProjectStore.setProject
}))(observer(ProjectsPage))