import TestPageStore from "./pageStores/TestPageStore";
import storeABC from "./storeABC";

class mainStore {
  constructor() {
    this.TestPageStore = new storeABC(TestPageStore);
  }
}
export default new mainStore()