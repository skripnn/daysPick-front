import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import {LocalUser} from "../js/functions/functions";
import {List, ListSubheader} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import SearchField from "../components/Fields/SearchField/SearchField";
import Fetch from "../js/Fetch";


function ProjectsPage(props) {
  const user = LocalUser()
  const {projects, setProjects, delProject} = props.pageStore
  const [filtered, setFiltered] = useState(null)


  // eslint-disable-next-line
  useEffect(get, [])

  function get() {
    Fetch.get('projects', {user: user}).then(setProjects)
  }

  function del(project) {
    Fetch.delete(['project', project.id]).then(() => delProject(project.id))
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  return (
    <div>
      <List dense>
        <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}} disableSticky>
          <SearchField get={(v) => Fetch.get('projects', {user: user, ...v})} set={setFiltered} calendar={props.calendar} user={localStorage.User}/>
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
    setProject: stores.ProjectStore.setProject,
    calendar: stores.UsersStore.getLocalUser().calendar
}))(observer(ProjectsPage))