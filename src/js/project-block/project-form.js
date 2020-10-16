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
  return (
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="center"
          spacing={3}
        >
          <Grid item xs={12} md={6}>
            <Grid container direction="row" spacing={3}>
              <GridItemTextField id="title" label="Название" defaultValue={props.title} required/>
              <GridItemTextField id="money" label="Гонорар" defaultValue={props.money} inputMode="numeric"/>
              <GridItemTextFieldAuto id="client" label="Клиент" defaultValue={props.client} options={props.clients} required/>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="row" spacing={3}>
              <GridItemTextField id="info" label="Информация" defaultValue={props.info} multiline rows={8}/>
            </Grid>
          </Grid>
        </Grid>
  )
}

