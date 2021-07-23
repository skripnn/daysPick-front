import {useEffect, useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
