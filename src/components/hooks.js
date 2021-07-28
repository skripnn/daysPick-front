import {useEffect, useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TouchHold from "../js/TouchHold";
import {useWindowHeight} from "@react-hook/window-size";

export function useOnFocusHook(func) {
  useEffect(() => {
    window.addEventListener("focus", func)
    return () => {
      window.removeEventListener("focus", func)
    }
  //eslint-disable-next-line
  }, [])
  return null
}


export function useListStore() {
  const [list, setList] = useState([])
  const [pages, setPages] = useState(null)
  const [page, setPage] = useState(null)

  const set = (r) => {
    setPages(r? r.pages : null)
    setList(r? r.list : [])
    setPage(r? 1 : null)
  }

  const add = (r={}) => {
    setList([...list, ...r.list])
    setPage(page + 1)
  }

  return {
    list: list,
    page: page,
    pages: pages,
    set: set,
    add: add
  }
}

export function useMobile() {
  return useMediaQuery('(max-width:600px)')
}


export function useControlledState(state, setState) {
  const [store, setStore] = useState(state)
  useEffect(() => {
    setStore(state)
  }, [state])
  return [store, setState? setState : setStore]
}


export function useTouchHold(onTouchHold, onTouchEnd) {
  const [touchHold] = useState(new TouchHold(onTouchHold, onTouchEnd))
  return touchHold.actions
}

export function useWindowHeightResizeCallback(func) {
  const [height, setHeight] = useState()
  const heightWidow = useWindowHeight()
  if (heightWidow !== height) {
    setHeight(heightWidow)
    func()
  }
}
