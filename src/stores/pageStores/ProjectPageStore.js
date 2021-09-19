import {makeAutoObservable} from "mobx";
import CalendarStore from "../modelStores/CalendarStore";
import ProjectStore from "../modelStores/ProjectStore";
import {compareId} from "../../js/functions/functions";


class ProjectPageStore {
  project = new ProjectStore()
  downloadedValues = new ProjectStore()
  calendar = new CalendarStore()

  constructor() {
    makeAutoObservable(this)
  }

  setValue = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      this[key].setValue(value)
    }
  }

  setDays = (daysPick) => {
    this.calendar.setValue({daysPick: daysPick})
    this.project.setValue({days: Object.fromEntries(daysPick.map(i => [i, this.project.days[i] || null]))})
  }

  setUser = (value) => {
    if (!compareId(value, this.project.user)) this.calendar = new CalendarStore()
    this.project.setValue({user: value})
  }

  download = (obj, template=false) => {
    this.project = new ProjectStore()
    this.downloadedValues = new ProjectStore()
    this.calendar = new CalendarStore()
    if (obj.project) {
      this.project.setValue(obj.project)
      if (!template) this.downloadedValues.setValue(obj.project)
    }
    if (obj.calendar) {
      this.calendar.setValue(obj.calendar)
    }
  }

  downloadFromTemplate = (obj) => this.download(obj, true)

}

export default ProjectPageStore
