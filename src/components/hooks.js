import {useEffect, useState} from "react";

export function useOnFocusHook(func) {
  useEffect(() => {
    window.addEventListener("focus", func)
    return () => {
      window.removeEventListener("focus", func)
    }
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