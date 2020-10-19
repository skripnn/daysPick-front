import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Autocomplete from '@material-ui/lab/Autocomplete';

function GridItemTextField(props) {
  return (
    <Grid item xs={12}>
      <TextField size="small"
                 fullWidth
                 {...props}/>
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
                                 {...params}/>
                    )}
      />
    </Grid>
  )
}

export function ProjectForm(props) {


  const disabled = props.creator !== localStorage.getItem('User')

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
          <GridItemTextField id="title" label="Название" {...v(props.title)} required/>
          <GridItemTextField id="money" label="Гонорар" {...v(props.money)} inputMode="numeric"/>
          <GridItemTextFieldAuto id="client" label="Клиент" {...v(props.client)} options={props.clients} required/>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <GridItemTextField id="info" label="Информация" {...v(props.info)} multiline rows={8}/>
        </Grid>
      </Grid>
    </Grid>
  )
}

