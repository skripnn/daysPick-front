import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

function GridItemTextField(props) {
  let [value, setValue] = useState(props.value)
  function validation(e) {
    if (props.inputMode === 'numeric') {
      const re = new RegExp('[\\D]')
      setValue(e.target.value.replace(re, ''))
    }
  }

  return (
    <Grid item xs={12}>
      <TextField size="small"
                 fullWidth
                 value={value}
                 {...props}
                 onChange={validation}
                 autoComplete='off'/>
    </Grid>
  )
}

function GridItemTextFieldAuto(props) {
  if (props.value) {
    return <GridItemTextField id="client" label="Клиент" value={props.value} required/>
  }

  return (
    <Grid item xs={12}>
      <Autocomplete {...props}
                    freeSolo
                    options={props.options}
                    renderInput={(params) => (
                      <TextField size="small"
                                 fullWidth
                                 label={props.label}
                                 required={props.required}
                                 name={props.name}
                                 {...params}/>
                    )}
      />
    </Grid>
  )
}

function GridItemBoolean(props) {
  return (
    <Grid item xs={12}>
      <FormControlLabel
        name={props.name}
        control={<Checkbox color="primary" defaultChecked={props.checked}/>}
        label="Оплачено"
        labelPlacement="end"
      />
    </Grid>
  )
}


export function ProjectForm(props) {
  const disabled = props.creator && props.creator !== localStorage.getItem('User')
  const v = (prop) => {
    return disabled? {value: prop} : {defaultValue: prop}
  }

  return (
    <Grid container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <GridItemTextField id="title" name="title" label="Название" {...v(props.title)} required/>
          <GridItemTextField id="money" name="money" label="Гонорар" {...v(props.money)} inputMode="numeric"/>
          <GridItemTextFieldAuto id="client" name="client" label="Клиент" {...v(props.client)} options={props.clients} required/>
          <GridItemBoolean id="is_paid" name="is_paid" label="Оплачено" checked={props.is_paid}/>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <GridItemTextField id="info" name="info" label="Информация" {...v(props.info)} multiline rows={10}/>
        </Grid>
      </Grid>
    </Grid>
  )
}

