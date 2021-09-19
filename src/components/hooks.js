import {useEffect, useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TouchHold from "../js/TouchHold";
import {useWindowHeight} from "@react-hook/window-size";
import mainStore from "../stores/mainStore";

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

export function useSearchList() {
  const fullList = useListStore()
  const filteredList = useListStore()
  const {list, page, pages, add} = !!filteredList.pages ? filteredList : fullList

  function reset() {
    fullList.set()
    filteredList.set()
  }

  function fullListSet(v) {
    filteredList.set()
    fullList.set(v)
  }

  return {
    fullListSet: fullListSet,
    filteredListSet: filteredList.set,
    list: list,
    page: page,
    pages: pages,
    add: add,
    reset: reset
  }
}

export function useMobile() {
  return useMediaQuery('(max-width:600px)')
}

export function useMobileUpdate() {
  const isMobile = useMediaQuery('(max-width:600px)')
  useEffect(() => {mainStore.InfoBar.setMobile(isMobile)}, [isMobile])
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

export function useMount(func) {
  // eslint-disable-next-line
  useEffect(func, [])
}

export function useColorScheme() {
  const lightTheme = useMediaQuery('(prefers-color-scheme: light)')
  useEffect(() => {
    const favicon = document.getElementById('favicon')
    if (lightTheme) favicon.href = favicon.href.replace('favicon.ico', 'favicon-black.ico')
    else favicon.href = favicon.href.replace('favicon-black.ico', 'favicon.ico')
  }, [lightTheme])
}

export function useIntersection(children, callback, ref) {

  const [intersection, setIntersection] = useState(false)
  // статус пересечения
  const [element, setElement] = useState(null)
  // элемент для зависимости
  const [observer, setObserver] = useState(null)
  // наблюдатель

  function changeIntersection(a) {
    // изменения статуса пересечения
    if (a[0].isIntersecting || (!!a[0].rootBounds && a[0].boundingClientRect.bottom < a[0].rootBounds.top)) setIntersection(true)
  }

  useEffect(() => {
    // сброс зависимостей при размонтировании компонента
    return () => {
      if (observer) {
        if (observer[0]) observer[0].disconnect()
        if (observer[1]) observer[1].disconnect()
      }
    }
  })

  useEffect(() => {
    // коллбэк при пересечении
    if (intersection) callback()
    // eslint-disable-next-line
  }, [intersection])

  // eslint-disable-next-line
  useEffect(newElement, [children])

  function newElement() {
    // обновление элемента для зависимости
    const ch = ref.current.childNodes
    let el
    if (ch.length > 5) el = ch[ch.length - 5]
    if (el && el !== element) {
      if (element) observer.unobserve(element)
      setElement(el)
    }
  }

  // eslint-disable-next-line
  useEffect(setObservableTarget, [element, observer])

  function setObservableTarget() {
    // установка новых зависимостей
    if (observer && element) observer.observe(element)
    setIntersection(false)
  }

  // eslint-disable-next-line
  useEffect(setObservableRoot, [ref.current])

  function setObservableRoot() {
    // установка наблюдателя на родителя зависимостей
    if (observer) observer.disconnect()
    if (ref.current) setObserver(new IntersectionObserver(changeIntersection, {root: ref.current, threshold: 1.0}))
  }

  return intersection
}




export function useListStore2() {
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

  const del = (id) => {
    const listCopy = [...list]
    const delFromChildren = (id, item) => {
      const i = item.children.findIndex((item) => item.id === id)
      if (i !== -1) item.children.splice(i, 1)
    }

    const i = listCopy.findIndex((item) => {
      if (item.children) delFromChildren(id, item)
      return item.id === id
    })
    if (i !== -1) listCopy.splice(i, 1)
    setList(listCopy)
  }

  const setItem = (value) => {
    setList(list.map(item => item.id === value.id ? value : item))
  }

  const getItem = (id) => list.find(item => item.id === id)

  return {
    list: list,
    page: page,
    pages: pages,
    set: set,
    add: add,
    del: del,
    setItem: setItem,
    getItem: getItem
  }
}
