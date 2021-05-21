import React from "react";
import Grid from "@material-ui/core/Grid";
import MoneyField from "../Fields/MoneyField/MoneyField";
import InfoField from "../Fields/InfoField/InfoField";
import TextField from "../Fields/TextField/TextField";
import {inject, observer} from "mobx-react";
import ClientField from "../Fields/ClientField/ClientField";
import CheckBoxField from "../Fields/CheckBoxField/CheckBoxField";
import UserField from "../Fields/UserField/UserField";
import Typography from "@material-ui/core/Typography";
import FolderField from "../Fields/FolderField/FolderField";

function ProjectForm(props) {
  const {title, is_paid, is_wait, client, setValue, user, creator, canceled, is_folder, parent, clientListStore} = props.ProjectStore
  const selfProject = user === creator

  const checkBoxes = (
    <Grid container wrap={'nowrap'}>
      <Grid item xs>
        <CheckBoxField name={'is_paid'} label={'Оплачено'} checked={is_paid}
                       onChange={v => setValue({is_paid: v})}/>
      </Grid>
      {!is_paid && <Grid item xs style={{whiteSpace: 'nowrap'}}>
        <CheckBoxField name={'is_wait'} label={canceled ? 'Отменён' : 'Не подтверждён'} checked={is_wait}
                       onChange={v => setValue({is_wait: v})}/>
      </Grid>}
    </Grid>
  )

  const left = is_folder ? [
    <TextField label="Название" value={title} onChange={e => setValue({title: e.target.value})} required/>,
    <InfoField/>
  ] :
  [
    // <UserField value={user} set={v => setValue({user: v ? v.username : localStorage.User})} required
    //            disabled={creator !== localStorage.User}/>,
    <TextField label="Название" value={title} onChange={e => setValue({title: e.target.value})}/>,
    <MoneyField />,
    selfProject ?
        <ClientField client={client} set={(client) => setValue({client: client})}/> :
        <UserField value={creator} label={'Клиент'} disabled/>,
    <FolderField value={parent} set={(parent) => setValue({parent: parent})} f={clientListStore}/>,
    checkBoxes
  ]
  const right = is_folder ? [
    <div style={{textAlign: 'center', width: '100%'}}>
      <Typography color={'secondary'} variant={'overline'}>Значения по умолчанию</Typography>
    </div>,
    <MoneyField />,
    <ClientField client={client} set={(client) => setValue({client: client})}/>
  ] : [
    <InfoField/>
  ]


  return (
    <Grid container justify="space-between" alignItems="flex-start" spacing={3} style={{marginTop: 12}}>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {left.map((item, id) => <Grid item xs={12} key={id}>{item}</Grid>)}
        </Grid>
      </Grid>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {right.map((item, id) => <Grid item xs={12} key={id}>{item}</Grid>)}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default inject('ProjectStore')(observer(ProjectForm))