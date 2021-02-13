import UsersStore from "./pageStores/UsersStore";
import ProjectStore from "./pageStores/ProjectStore";
import ClientsPageStore from "./pageStores/ClientsPageStore";
import ProjectsPageStore from "./pageStores/ProjectsPageStore";

class mainStore {
  constructor() {
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
    this.ProjectsPageStore = new ProjectsPageStore()
  }
}
export default new mainStore()