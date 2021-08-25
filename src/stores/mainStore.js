import UsersStore from "./modelStores/UsersStore";
import ProjectStore from "./modelStores/ProjectStore";
import ClientsPageStore from "./pageStores/ClientsPageStore";
import ProjectsPageStore from "./pageStores/ProjectsPageStore";
import SearchPageStore from "./pageStores/SearchPageStore";
import InfoBarStore from "./modelStores/InfoBarStore";
import AccountStore from "./modelStores/AccountStore";

class mainStore {
  constructor() {
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
    this.ProjectsPageStore = new ProjectsPageStore()
    this.OffersPageStore = new ProjectsPageStore()
    this.SearchPageStore = new SearchPageStore()
    this.InfoBarStore = new InfoBarStore()
    this.AccountStore = new AccountStore()
  }

  reset = () => {
    this.UsersStore = new UsersStore()
    this.ProjectStore = new ProjectStore()
    this.ClientsPageStore = new ClientsPageStore()
    this.ProjectsPageStore = new ProjectsPageStore()
    this.OffersPageStore = new ProjectsPageStore()
    this.SearchPageStore = new SearchPageStore()
    this.AccountStore = new AccountStore()
  }
}
export default new mainStore()
