import React, {useEffect, useRef, useState} from "react";
import Fetch from "../../js/Fetch";
import {CircularProgress, List, ListSubheader} from "@material-ui/core";
import PropTypes from "prop-types";
import SearchField from "../Fields/SearchField/SearchField";

function LazyList(props) {
  const {children, set, add, pages, page, setPage, getLink, getParams, searchFieldParams, noSearchField, observableRoot, preLoader, onFilterChange, ...otherProps} = props
  const [filter, setFilter] = useState(null)

  const ref = useRef()

  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState(false)
  const [element, setElement] = useState(null)
  const [observer, setObserver] = useState(new IntersectionObserver(changeIntersection, observableRoot? {root: observableRoot} : undefined))
  function changeIntersection(a) {
    if (a[0].isIntersecting || (!!a[0].rootBounds && a[0].boundingClientRect.bottom < a[0].rootBounds.top)) setRequest(true)
  }

  let params = getParams? {...getParams} : {}
  params.page = page
  if (filter) params = {...params, ...filter}


  useEffect(() => {
    if (onFilterChange) onFilterChange(filter)
  // eslint-disable-next-line
  }, [filter])

  useEffect(() => {
    if (pages === null && set) {
      Fetch.post(getLink, {...params, page: 0}).then(r => {
        set(r)
        setLoading(false)
      })
    }
    return (() => {
      if (searchFieldParams) searchFieldParams.set(null)
      observer.disconnect()
    })
    // eslint-disable-next-line
  }, [])

  // eslint-disable-next-line
  useEffect(fetchAndAdd, [request])
  function fetchAndAdd() {
    if (request && page < pages) Fetch.post(getLink, params).then(add)
  }

  // eslint-disable-next-line
  useEffect(findObservableTarget, [children])
  function findObservableTarget() {
    setRequest(false)
    if (!ref.current) return
    const ch = ref.current.childNodes
    let el
    if (ch.length > 5) el = ch[ch.length - 5]
    if (el && el !== element) {
      if (element) observer.unobserve(element)
      setElement(el)
    }
  }

  // eslint-disable-next-line
  useEffect(setObservableTarget, [element])
  function setObservableTarget() {
    if (element) observer.observe(element)
  }

// eslint-disable-next-line
  useEffect(setObservableRoot, [observableRoot])
  function setObservableRoot() {
    observer.disconnect()
    setObserver(new IntersectionObserver(changeIntersection, observableRoot? {root: observableRoot} : undefined))
    if (element) observer.observe(element)
  }

  const filterGet = (v) => Fetch.post(getLink, {...params, page: 0, ...v}).then(r => {
      setFilter(v)
      return r
    })

  function filterSet(v) {
    setRequest(false)
    if (v === null) setFilter(null)
    if (searchFieldParams) searchFieldParams.set(v)
  }

  const preLoading = preLoader && page == null && pages == null

  return (
    <List dense ref={ref} {...otherProps}>
      {!!searchFieldParams && <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}} disableSticky>
        <SearchField {...searchFieldParams} get={filterGet} set={filterSet}/>
      </ListSubheader>}
      {children}
      {(loading || preLoading || page < pages) && <div style={{display: "flex", justifyContent: 'center', opacity: 0.5, paddingTop: 8}}><CircularProgress size={24} color={'secondary'} /></div>}
    </List>
  )
}

LazyList.propTypes = {
  searchFieldParams: PropTypes.shape({
    set: PropTypes.func,
    calendar: PropTypes.shape({
      days: PropTypes.object,
      daysOff: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      daysPick: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    }),
    calendarGet: PropTypes.func,
    noFilter: PropTypes.bool,
    minFilter: PropTypes.number,
    initDays: PropTypes.array,
    onChangeDays: PropTypes.func
  }),
  observableRoot: PropTypes.instanceOf(Element),
  children: PropTypes.node,
  set: PropTypes.func,
  add: PropTypes.func,
  pages: PropTypes.number,
  page: PropTypes.number,
  getParams: PropTypes.object,
  getLink: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  onFilterChange: PropTypes.func
}

export default LazyList
