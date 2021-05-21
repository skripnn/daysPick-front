import {makeAutoObservable} from "mobx";
import ListStore from "../modelStores/ListStore";

class ProjectsPageStore {

  p = new ListStore()
  f = new ListStore()

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

}

export default ProjectsPageStore