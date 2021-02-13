import React from "react";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ClientChoice from "../Fields/ChoiseField/ChoiceField";
import MoneyField from "../Fields/MoneyField/MoneyField";
import InfoField from "../Fields/InfoField/InfoField";
import TextField from "../Fields/TextField/TextField";
import {inject, observer} from "mobx-react";

function ProjectForm(props) {
  const {title, is_paid, setValue} = props.ProjectStore

  return (
    <Grid container className={'project-form'} justify="space-between" alignItems="flex-start" spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>
            <TextField label="Название" value={title} onChange={e => setValue({title: e.target.value})} required/>
          </Grid>
          <Grid item xs={12}>
            <MoneyField />
          </Grid>
          <Grid item xs={12}>
            <ClientChoice />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel labelPlacement="end"  name='is_paid' label='Оплачено' control={
              <Checkbox color="primary" checked={is_paid} onChange={e => setValue({is_paid: e.target.checked})}/>
            }/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoField />
      </Grid>
    </Grid>
  )
}

export default inject('ProjectStore')(observer(ProjectForm))