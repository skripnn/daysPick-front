import React, {useEffect, useRef, useState} from "react";
import Fetch from "../../js/Fetch";
import {List, ListSubheader} from "@material-ui/core";
import PropTypes from "prop-types";
import SearchField from "../Fields/SearchField/SearchField";

function LazyList(props) {
  const {children, set, add, pages, page, setPage, getLink, getParams, searchFieldParams, noSearchField, ...otherProps} = props

  const [filter, setFilter] = useState(null)
  const [request, setRequest] = useState(false)

  let params = getParams || {}
  params.page = page
  if (filter) params = {...params, ...filter}

  const ref = useRef()

  useEffect(() => {
    if (pages === null && set) {
      Fetch.post(getLink, {...params, page: 0}).then((r) => set(r))
    }
    document.addEventListener('scroll', scan)
    window.addEventListener('resize', scan)

    return (() => {
      document.removeEventListener('scroll', scan)
      window.removeEventListener('resize', scan)
      searchFieldParams.set(null)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (request && page < pages) Fetch.post(getLink, params).then(r => {
      add(r)
      setRequest(false)
    })
    // eslint-disable-next-line
  }, [request])

  // eslint-disable-next-line
  useEffect(scan, [children])

  function scan() {
    if (!ref.current) return
    if (request) return
    const ch = ref.current.childNodes
    let el
    if (ch.length > 5) el = ch[ch.length - 5]
    if (el && el.getBoundingClientRect().bottom <= document.documentElement.clientHeight) setRequest(true)
  }

  const filterGet = (v) => Fetch.post(getLink, {...params, page: 0, ...v}).then(r => {
      setFilter(v)
      return r
    })

  function filterSet(v) {
    setRequest(false)
    if (v === null) setFilter(null)
    searchFieldParams.set(v)
  }

  return (
    <List dense ref={ref} {...otherProps}>
      {!noSearchField && <ListSubheader style={{background: 'white', lineHeight: "unset", padding: "unset"}} disableSticky>
        <SearchField {...searchFieldParams} get={filterGet} set={filterSet}/>
      </ListSubheader>}
      {children}
    </List>
  )
}

LazyList.propTypes = {
  noSearchFiled: PropTypes.bool,
  searchFieldParams: PropTypes.shape({
    set: PropTypes.func,
    calendar: PropTypes.shape({
      days: PropTypes.object,
      daysOff: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
      daysPick: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    }),
    user: PropTypes.string,
    noFilter: PropTypes.bool,
    categoryFilter: PropTypes.bool,
    minFilter: PropTypes.number
  }),
  children: PropTypes.node,
  set: PropTypes.func,
  add: PropTypes.func,
  pages: PropTypes.number,
  page: PropTypes.number,
  getParams: PropTypes.object,
  getLink: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
}

export default LazyList