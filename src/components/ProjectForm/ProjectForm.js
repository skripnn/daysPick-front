import React from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ClientChoice from "../Fields/ChoiseField/ChoiceField";
import MoneyField from "../Fields/MoneyField/MoneyField";
import InfoField from "../Fields/InfoField/InfoField";
import TextField from "../Fields/TextField/TextField";

export default function ProjectForm(props) {
  return (
    <Grid container className={'project-form'} justify="space-between" alignItems="flex-start" spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>
            <TextField label="Название" value={props.title} onChange={e => props.setValue({title: e.target.value})} required/>
          </Grid>
          <Grid item xs={12}>
            <MoneyField {...props}/>
          </Grid>
          <Grid item xs={12}>
            <ClientChoice {...props}/>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel labelPlacement="end"  name='is_paid' label='Оплачено' control={
              <Checkbox color="primary" checked={props.is_paid} onChange={e => props.setValue({is_paid: e.target.checked})}/>
            }/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoField {...props}/>
      </Grid>
    </Grid>
  )
}
