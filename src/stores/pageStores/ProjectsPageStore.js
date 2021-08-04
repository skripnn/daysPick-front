import {makeAutoObservable} from "mobx";
import ListStore from "../modelStores/ListStore";

class ProjectsPageStore {

  p = new ListStore()
  f = new ListStore()
  statistics = {
    days: 0,
    projects: 0,
    sum: 0
  }

  constructor() {
    makeAutoObservable(this)
  }

  clear = () => {
    this.p.set()
    this.f.set()
  }

  delProject = (id) => {
    this.p.del(id)
    this.f.del(id)
  }

  setProject = (project) => {
    this.p.setItem(project)
    this.f.setItem(project)
  }

  getProject = (id) => {
    return this.p.getItem(id) || this.f.getItem(id)
  }


  setValue = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  }

}

export default ProjectsPageStore
