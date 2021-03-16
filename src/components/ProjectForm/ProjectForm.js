import React from "react";
import Grid from "@material-ui/core/Grid";
import MoneyField from "../Fields/MoneyField/MoneyField";
import InfoField from "../Fields/InfoField/InfoField";
import TextField from "../Fields/TextField/TextField";
import {inject, observer} from "mobx-react";
import ClientField from "../Fields/ClientField/ClientField";
import CheckBoxField from "../Fields/CheckBoxField/CheckBoxField";

function ProjectForm(props) {
  const {title, is_paid, is_wait, client, setValue} = props.ProjectStore

  return (
    <Grid container justify="space-between" alignItems="flex-start" spacing={3} style={{marginTop: 12}}>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12}>
            <TextField label="Название" value={title} onChange={e => setValue({title: e.target.value})} required/>
          </Grid>
          <Grid item xs={12}>
            <MoneyField />
          </Grid>
          <Grid item xs={12}>
            <ClientField client={client} set={(client) => setValue({client: client})}/>
          </Grid>
          <Grid item xs={12} container wrap={'nowrap'}>
            <Grid item xs>
              <CheckBoxField name={'is_paid'} label={'Оплачено'} checked={is_paid} onChange={v => setValue({is_paid: v})}/>
            </Grid>
            {!is_paid && <Grid item xs style={{whiteSpace: 'nowrap'}}>
              <CheckBoxField name={'is_wait'} label={'Не подтверждён'} checked={is_wait} onChange={v => setValue({is_wait: v})}/>
            </Grid>}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm md={6}>
        <InfoField />
      </Grid>
    </Grid>
  )
}

export default inject('ProjectStore')(observer(ProjectForm))