import React, {createRef, useEffect, useRef, useState} from "react";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Box from "@material-ui/core/Box";
import {IconButton, InputAdornment, Typography} from "@material-ui/core";
import {Clear} from "@material-ui/icons";
import "./DateRangeField.css"
import {dateRange} from "../../Calendar/extention/date";
import TextField from "../TextField/TextField";
import moment from "moment";
import "moment/locale/ru";


function DateRangeField(props) {
  const [range, setRange] = useState(props.range || {start: null, end: null})
  const [edit, setEdit] = useState(false)
  const refStart = createRef()
  const refEnd = createRef()
  const refInput = useRef()
  moment.locale("ru")

  window.addEventListener('mousedown', e => {
    if (!e.target.closest('.date-range-field') && !e.target.closest('div[role=dialog]')) setEdit(false)
  })
  window.addEventListener('touchstart', e => {
    if (!e.touches[0].target.closest('.date-range-field') && !e.touches[0].target.closest('div[role=dialog]')) setEdit(false)
  })

  useEffect(() => {
    if (range.start && range.end) {
      if (range.end < range.start) updateRange({end: range.start})
      else if (range.start.isValid() && range.end.isValid() && props.set) {
        if (props.raw) props.set(range)
        else props.set(dateRange(range.start, range.end))
      }
    }
    else if (range.start && range.start.isValid() && !range.end && refEnd) refEnd.current.focus()
  //  eslint-disable-next-line
  }, [range])

  useEffect(() => {setRange(props.range || {})}, [props.range])

  function updateRange(obj) {
    if (obj.start && !obj.end && range.end < obj.start) obj.end = null
    props.setRange? props.setRange(prevState => ({...prevState, ...obj})) : setRange(prevState => ({...prevState, ...obj}))
  }

  const notNull = !!(range.start || range.end || edit)

  const error = (v) => !!(v && v._i && v._i.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/) && !v.isValid())

  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={'ru'}>
        <div style={{position: "relative"}} className={'date-range-field'}>
          {notNull &&
          <Box display={'flex'} alignItems={'center'} style={{position: "absolute", left: 0, bottom: 0, zIndex: 5}}>
            <KeyboardDatePicker
              cancelLabel={'Отмена'}
              inputProps={{ref: refStart, type: 'tel', style: {width: 90}}}
              invalidDateMessage={null}
              autoFocus
              error={error(range.start)}
              autoOk
              value={range.start || null}
              onChange={date => {
                updateRange({start: date})
              }}
              format="DD-MM-YYYY"
              onError={(error) => {
                if (error) updateRange({start: null})
              }}
              onBlur={() => {
                if (range.start && !range.start.isValid()) updateRange({start: null})
              }}
            />
            <Typography color={'secondary'} style={{padding: "0 5px"}}>—</Typography>
            <KeyboardDatePicker
              cancelLabel={'Отмена'}
              inputProps={{ref: refEnd, type: 'tel', style: {width: 90}}}
              invalidDateMessage={null}
              autoOk
              error={error(range.end)}
              value={range.end || null}
              onChange={date => updateRange({end: date})}
              minDate={range.start || undefined}
              format="DD-MM-YYYY"
              onError={(error) => {
                if (error) updateRange({end: null})
              }}
              onBlur={() => {
                if (range.end && !range.end.isValid()) updateRange({end: null})
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !range.end && refStart) refStart.current.focus()
              }}
            />
            <IconButton onClick={() => {
              updateRange({start: null, end: null})
              setEdit(false)
              if (props.clear) props.clear()
              else if (props.set) props.set(null)
            }} size={'small'}>
              <Clear/>
            </IconButton>
          </Box>
          }
          <TextField
            fullWidth={false}
            InputLabelProps={{shrink: notNull, disabled: false}}
            style={{width: 344.66}}
            inputProps={{disabled: true, style: {cursor: 'text'}, ref: refInput}}
            label={'Диапазон дат'}
            onClick={(e) => {if (e.target === refInput.current && !notNull) setEdit(true)}}
            InputProps={{
              disabled: notNull,
              endAdornment: (!notNull && props.clear &&
                <InputAdornment position={"end"}>
                  <IconButton onClick={() => {
                    setEdit(false)
                    props.clear()
                  }} size={'small'}>
                    <Clear/>
                  </IconButton>
                </InputAdornment>)}}
          />
        </div>
    </MuiPickersUtilsProvider>
  )
}

export default DateRangeField