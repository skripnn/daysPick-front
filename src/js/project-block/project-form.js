import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

function GridItemTextField(props) {
  return (
    <Grid item xs={12}>
      <TextField size="small"
                 fullWidth

                 {...props}/>
    </Grid>
  )
}

function ContactForm(props) {
  return (
    <>
      <GridItemTextField id="name" label="Контакт" defaultValue={props.name} required/>
      <GridItemTextField id="phone" label="Телефон" defaultValue={props.phone} inputMode="tel"/>
    </>
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
              <ContactForm {...props.contact}/>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="row" spacing={3}>
              <GridItemTextField id="info" label="Информация" defaultValue={props.info} multiline rows={12}/>
            </Grid>
          </Grid>
        </Grid>
  )
}

