import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {getClientsOptions} from "../../js/functions/fetch";

export default function ProjectForm(props) {

  const [clientOptions, setClientOptions] = useState([])

  useEffect(() => {
    getClientsOptions().then(result => setClientOptions(result))
  }, [])


  const numValid = (str) => parseInt(str)? parseInt(str) : null
  console.log(props)
  return (
    <Grid container className={'project-form'} justify="space-between" alignItems="center" spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>

            <TextField size="small" fullWidth onChange={(e) => props.onChange({title: e.target.value})} name='title' label='Название' value={props.title} autoComplete='off'/>

          </Grid>
          <Grid item xs={12}>

            <TextField size="small" fullWidth onChange={(e) => props.onChange({money: numValid(e.target.value)})} name='money' label='Гонорар' value={props.money? props.money : ''} autoComplete='off'/>

          </Grid>
          <Grid item xs={12}>

            <Autocomplete options={clientOptions} freeSolo name='client' label='Клиент' value={props.client} renderInput={(params) => (
              <TextField size="small" fullWidth onChange={(e) => props.onChange({client: e.target.value})} onBlur={(e) => props.onChange({client: e.target.value})} name='client' label='Клиент' {...params}/>)}/>

          </Grid>
          <Grid item xs={12}>

            <FormControlLabel labelPlacement="end"  name='is_paid' label='Оплачено' control={
              <Checkbox color="primary" checked={props.is_paid} onChange={(e) => props.onChange({is_paid: e.target.checked})}/>}/>

          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>

            <TextField size="small" fullWidth onChange={(e) => props.onChange({info: e.target.value})} multiline rows={10} name='info' label='Информация' value={props.info} autoComplete='off'/>

          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}