import React, {useEffect, useState} from "react";
import {deleteProject, getProjects} from "../js/fetch/project";
import {inject, observer} from "mobx-react";
import {LocalUser} from "../js/functions/functions";
import {List, ListSubheader} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import SearchField from "../components/Fields/SearchField/SearchField";


function ProjectsPage(props) {
  const user = LocalUser()
  const {projects, setProjects, delProject} = props.pageStore
  const [filtered, setFiltered] = useState(null)


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
    <div>
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset"}}>
          <SearchField get={(v) => getProjects(user, v)} set={setFiltered}/>
        </ListSubheader>
        {(filtered || projects).map(project => <ProjectItem
          project={project}
          key={project.id}
          onClick={link}
          onDelete={del}
        />)}
      </List>
    </div>
  )
}

export default inject(stores => ({
    pageStore: stores.ProjectsPageStore,
    setProject: stores.ProjectStore.setProject
}))(observer(ProjectsPage))