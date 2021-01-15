import {makeAutoObservable} from 'mobx';
import {setSubValue, setValue} from "../storeABC";

class TestPageStore {
  int = 0
  bool = true

  constructor() {
    makeAutoObservable(this)
  }

  setValue = setValue
  setSubValue = setSubValue

}


export default TestPageStore