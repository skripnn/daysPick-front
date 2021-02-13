import {makeAutoObservable} from "mobx";

class ProjectsPageStore {
  projects = []

  constructor() {
    makeAutoObservable(this)
  }

  setProjects = (projects) => {
    for (const project of projects) this.setProject(project)
    this.projects = [...this.projects]
  }

  delProject = (id) => {
    const i = this.projects.findIndex((project) => project.id === id)
    if (i !== -1) this.projects.splice(i, 1)
    this.projects = [...this.projects]
  }

  setProject = (project) => {
    const i = this.projects.findIndex((p) => p.id === project.id)
    if (i !== -1) this.projects[i] = project
    else this.projects.push(project)
  }

  getProject = (id) => {
    return this.projects.find(project => project.id === id)
  }

}

export default ProjectsPageStore