import {CircularProgress, IconButton, InputAdornment} from "@material-ui/core";
import {Close, DateRange, Search} from "@material-ui/icons";
import TextField from "../TextField/TextField";
import React, {useEffect, useRef, useState} from "react";
import Box from "@material-ui/core/Box";
import Calendar from "../../Calendar";
import Loader from "../../../js/functions/Loader";
import {makeStyles} from "@material-ui/core/styles";
import {getCalendar} from "../../../js/fetch/calendar";

const useStyles = makeStyles({
  root: {
    overflow: "hidden",
    transition: "height 500ms ease",
    height: 0
  }
})

export default function SearchField(props) {
  const {get, set, noCalendar, calendar, user, ...newProps} = props

  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(null)
  const [content, setContent] = useState(calendar? {...calendar} : {days: {}, daysOff: new Set(), daysPick: new Set()})
  // eslint-disable-next-line
  useEffect(download, [days, filter])

  const ref = useRef()

  function download() {
    Loader.clear()
    const search_filter = {}
    if (filter) search_filter.filter = filter
    if (days) search_filter.days = days
    if (filter || days) {
      setLoading(true)
      Loader.set(() => {
        get(search_filter).then(r => {
          set(r)
          setLoading(false)
        })
      })
    }
    else {
      set(null)
      setLoading(false)
    }
  }


  function filterButtonClick() {
    if (ref.current.offsetHeight === 0) {
      ref.current.style.height = `${ ref.current.scrollHeight }px`
    } else {
      ref.current.style.height = "0";
    }
  }
  const classes = useStyles()


  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'}>
        <TextField
          {...newProps}
          size={"medium"}
          value={filter || ''}
          onChange={(e) => setFilter(e.target.value || null)}
          InputProps={{
            startAdornment:
              <InputAdornment position={"start"}>
                <IconButton onClick={download} disabled={loading}>
                  {props.loading || loading? <CircularProgress style={{width: 24, height: 24}} color={"inherit"}/> : <Search />}
                </IconButton>
              </InputAdornment>,
            endAdornment: ((filter || days) &&
              <InputAdornment position={"end"}>
                <IconButton onClick={() => {
                  setFilter(null)
                  setDays(null)
                  setContent(prevState => ({...prevState, daysPick: new Set()}))
                }}>
                  <Close/>
                </IconButton>
              </InputAdornment>)}}
        />
        {!noCalendar && <IconButton onClick={filterButtonClick} size={'small'} >
          <DateRange style={days? {color: '#4db34b'} : undefined}/>
        </IconButton>}
        </Box>
        {!noCalendar && <div ref={ref} className={classes.root}>
          <Calendar
            edit
            onChange={v => v.length? setDays(v) : setDays(null)}
            get={user? (start, end) => getCalendar(start, end, user) : undefined}
            content={content}
            setContent={setContent}
          />
        </div>}
    </Box>

  )
}