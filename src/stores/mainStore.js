import UsersStore from "./modelStores/UsersStore";
import ProjectStore from "./modelStores/ProjectStore";
import ClientsPageStore from "./pageStores/ClientsPageStore";
import ProjectsPageStore from "./pageStores/ProjectsPageStore";
import SearchPageStore from "./pageStores/SearchPageStore";

class mainStore {
  constructor() {
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
    this.ProjectsPageStore = new ProjectsPageStore()
    this.SearchPageStore = new SearchPageStore()
  }

  reset = () => {
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
    this.ProjectsPageStore = new ProjectsPageStore()
    this.SearchPageStore = new SearchPageStore()
  }
}
export default new mainStore()