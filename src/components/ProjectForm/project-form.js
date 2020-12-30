import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

export function GridItemTextField(props) {

  function validation(str) {
    if (props.inputMode === 'numeric') {
      const re = new RegExp('[\\D]')
      return Number(str.replace(re, ''))
    }
    return str
  }

  function onChange(e) {
    let v = {}
    v[props.name] = validation(e.target.value)
    props.onChange(v)
  }

  return (
    <Grid item xs={12}>
      <TextField size="small"
                 fullWidth
                 {...props}
                 onChange={onChange}
                 autoComplete='off'/>
    </Grid>
  )
}

export function GridItemTextFieldAuto(props) {
  if (props.readOnly) {
    return <GridItemTextField id="client" label="Клиент" value={props.value} required/>
  }

  function onChange(e) {
    let v = {}
    v[props.name] = e.target.value
    props.onChange(v)
  }


  return (
    <Grid item xs={12}>
      <Autocomplete
        {...props}
        freeSolo
        options={props.options}
        renderInput={(params) => (
          <TextField
            size="small"
            fullWidth
            label={props.label}
            required={props.required}
            name={props.name}
            onChange={onChange}
            {...params}
          />)}
      />
    </Grid>
  )
}

export function GridItemBoolean(props) {
  function onChange(e) {
    let v = {}
    v[props.name] = e.target.checked
    props.onChange(v)
  }

  return (
    <Grid item xs={12}>
      <FormControlLabel
        name={props.name}
        control={<Checkbox color="primary" defaultChecked={props.checked} onChange={onChange}/>}
        label="Оплачено"
        labelPlacement="end"
      />
    </Grid>
  )
}
