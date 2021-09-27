import InfoBarStore from "./modelStores/InfoBarStore";
import AccountStore from "./modelStores/AccountStore";
import UserPageStore from "./pageStores/UserPageStore";
import SearchListStore from "./modelStores/SearchListStore";
import ListStore from "./modelStores/ListStore";
import ProjectPageStore from "./pageStores/ProjectPageStore";

class mainStore {
  constructor() {
    this.InfoBar = new InfoBarStore()
    this.Account = new AccountStore()
    this.UserPage = new UserPageStore()

    this.SearchPage = new ListStore()
    this.ClientsPage = new SearchListStore()
    this.ProjectsPage = new SearchListStore()
    this.OffersPage = new SearchListStore()
    this.FavoritesPage = new SearchListStore()

    this.ProjectPage = new ProjectPageStore()
  }
}
export default new mainStore()
