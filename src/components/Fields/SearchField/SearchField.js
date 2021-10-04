import {CircularProgress, Grid, IconButton, InputAdornment} from "@material-ui/core";
import {Close, DateRange, Search} from "@material-ui/icons";
import TextField from "../TextField/TextField";
import React, {useEffect, useRef, useState} from "react";
import Box from "@material-ui/core/Box";
import Calendar from '../../test/components/Calendar';
import Loader from "../../../js/Loader";
import "./SearchField.css"
import DateRangeField from "../DateRangeField/DateRangeField";
import Info from "../../../js/Info";
import {TagsSearchField} from "./TagsSearchField";

function SearchField(props) {
  const {get, set, noFilter, calendar, calendarGet, minFilter, initDays, onChangeDays, onChangeFilter, preSearch, filterProps, tagsFilter, ...newProps} = props

  const [filter, setFilter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [days, setDays] = useState(initDays || null)
  const [tags, setTags] = useState(null)
  const [range, setRange] = useState(null)
  const [content, setContent] = useState(calendar ? {...calendar} : {days: {}, daysOff: new Set(), daysPick: new Set(initDays)})

  const ref = useRef()

  // eslint-disable-next-line
  useEffect(download, [days, filter, tags])
  // eslint-disable-next-line
  useEffect(() => onChangeFilter(filter), [filter])

  const changeRange = (v) => {
    setDays(v)
    setContent(prevState => ({...prevState, daysPick: v ? v : new Set()}))
  }

  const changeDays = (v) => {
    setRange(null)
    setDays(v)
    if (onChangeDays) onChangeDays(v)
  }

  const clearDays = () => {
    setDays(null)
    setRange(null)
    setContent(prevState => ({...prevState, daysPick: new Set()}))
  }


  function download() {
    Loader.clear()
    const search_filter = {}
    if (filter && filter.length >= (minFilter || 0)) search_filter.filter = filter
    if (tags && tags.length) search_filter.tags = tags.map(i => i.id)
    if (days && days.length) search_filter.days = days
    const valid = minFilter ? (search_filter.filter || search_filter.tags) : !!Object.keys(search_filter).length
    if (valid) {
      setLoading(true)
      preSearch(search_filter)
      Loader.set(() => {
        get(search_filter).then(r => {
          set(r)
          setLoading(false)
        })
      })
    } else {
      set(null)
      setLoading(false)
    }
  }


  function filterButtonClick() {
    if (ref.current.offsetHeight === 0) {
      ref.current.style.height = `${ref.current.scrollHeight}px`
    } else {
      ref.current.style.height = "0";
    }
  }


  const startButton = (
    <IconButton onClick={download} disabled={loading} size={'small'}>
      {props.loading || loading ? <CircularProgress style={{width: 24, height: 24}} color={"inherit"}/> :
        <Search/>}
    </IconButton>
  )

  const endButton = ((filter || days) &&
    <InputAdornment position={"end"}>
      <IconButton size={'small'} onClick={() => {
        setFilter(null)
        clearDays()
      }}>
        <Close/>
      </IconButton>
    </InputAdornment>
  )


  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Box display={'flex'} className={'search-field'}>
        {!!tagsFilter ?
          <TagsSearchField
            {...newProps}
            value={filter || ''}
            onChange={v => setFilter(v || null)}
            onTagsChange={setTags}
            startAdornment={startButton}
            InputProps={{
              endAdornment: endButton,
              placeholder: (!!tags && !!tags.length) ? undefined : newProps.placeholder,
              autoFocus: newProps.autoFocus
            }}
          /> :
          <TextField
            {...newProps}
            size={"medium"}
            value={filter || ''}
            onChange={(v) => setFilter(v || null)}
            InputProps={{
              startAdornment:
                <InputAdornment position={"start"}>
                  {startButton}
                </InputAdornment>,
              endAdornment: endButton
            }}
          />
        }
        {!noFilter && <IconButton onClick={filterButtonClick} size={'small'} style={{height: "max-content", marginTop: 1}}>
          <DateRange style={days ? {color: '#4db34b'} : {}}/>
        </IconButton>}
      </Box>
      {!noFilter && <div ref={ref} className={'filter-block'}>
        <Grid container justify={'space-between'}>
          <Grid item xs={12} sm={'auto'}/>
          <Grid item xs={12} sm={'auto'}>
            <DateRangeField
              set={changeRange}
              range={range}
              setRange={setRange}
              clear={days ? clearDays : undefined}
            />
          </Grid>
        </Grid>
        <Calendar
          edit
          onChange={v => v.length ? changeDays(v) : changeDays(null)}
          get={calendarGet}
          content={content}
          setContent={setContent}
          onError={Info.error}
          firstDownload
        />
      </div>}
    </Box>

  )
}

SearchField.defaultProps = {
  set: () => {},
  onChangeFilter: () => {},
  preSearch: () => {},
}

export default SearchField
