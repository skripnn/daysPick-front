import TestPageStore from "./pageStores/TestPageStore";
import UsersStore from "./pageStores/UsersStore";
import ProjectStore from "./pageStores/ProjectStore";

class mainStore {
  constructor() {
    this.TestPageStore = new TestPageStore()
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
  }
}
export default new mainStore()