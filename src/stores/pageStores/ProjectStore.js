import {makeAutoObservable} from "mobx";
import {setValue} from "../storeABC";

class ProjectStore {
  default = {
    id: null,
    dates: [],
    title: '',
    money: null,
    client: null,
    is_paid: false,
    info: '',
    days: []
  }


  constructor() {
    this.reset()
    makeAutoObservable(this)
  }
  
  setValue = setValue

  reset = () => this.setValue(this.default)

  serializer = () => {
    const project = {}
    for (const key of Object.keys(this)) {
      project[key] = this[key]
    }
    return project
  }

}

export default ProjectStore