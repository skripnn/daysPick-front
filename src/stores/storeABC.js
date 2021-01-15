import {makeAutoObservable} from 'mobx';

export default class storeABC {

  constructor(initialStore) {
    this.setValue(initialStore)
    makeAutoObservable(this)
  }

  setValue(obj) {
    for (const [key, value] of Object.entries(obj)) {
      this[key] = value
    }
  };

  setSubValue(property, obj) {
    for (const [key, value] of Object.entries(obj)) {
      this[property][key] = value
    }
  }

}


export function setValue(obj) {
  for (const [key, value] of Object.entries(obj)) {
    this[key] = value
  }
}

export function setSubValue(property, obj) {
  for (const [key, value] of Object.entries(obj)) {
    this[property][key] = value
  }
}