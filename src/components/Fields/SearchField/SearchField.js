import {CircularProgress, IconButton, InputAdornment} from "@material-ui/core";
import {Close, Search} from "@material-ui/icons";
import TextField from "../TextField/TextField";
import React, {useState} from "react";

let searchTimer

export default function SearchField(props) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(null)

  function handleChange(v) {
    clearTimeout(searchTimer)
    setValue(v)
    if (props.get && props.set) {
      if (v) {
        setLoading(true)
        searchTimer = setTimeout(() => {
          props.get(v).then(r => {
            props.set(r)
            setLoading(null)
          })
        }, props.timeout || 1000)
      }
      else {
        props.set(null)
        setLoading(null)
      }
    }
    if (props.onChange) v? props.onChange(v) : props.onChange(null)
  }

  return (
    <TextField
      {...props}
      size={"medium"}
      label={props.label}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      InputProps={{
        startAdornment:
          <InputAdornment position={"start"}>
            <IconButton onClick={() => handleChange(value)} disabled={loading}>
              {props.loading || loading? <CircularProgress style={{width: 24, height: 24}} color={"inherit"}/> : <Search />}
            </IconButton>
          </InputAdornment>,
        endAdornment: ((value) &&
          <InputAdornment position={"end"}>
            <IconButton onClick={() => handleChange('')}>
              <Close/>
            </IconButton>
          </InputAdornment>),
      }}/>
  )
}