import TestPageStore from "./pageStores/TestPageStore";
import UsersStore from "./pageStores/UsersStore";
import ProjectStore from "./pageStores/ProjectStore";
import ClientsPageStore from "./pageStores/ClientsPageStore";

class mainStore {
  constructor() {
    this.TestPageStore = new TestPageStore()
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
  }
}
export default new mainStore()