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
  const {title, is_paid, is_wait, client, setValue, user, user_info, creator, creator_info, canceled, is_folder, parent, clientListStore} = props.ProjectStore

  const checkBoxes = (isPaid, isWait) => (
    <Grid container wrap={'nowrap'}>
      {isPaid && <Grid item xs>
        <CheckBoxField name={'is_paid'} label={'Оплачено'} checked={is_paid}
                       onChange={v => setValue({is_paid: v})}/>
      </Grid>}
      {!is_paid && isWait && <Grid item xs style={{whiteSpace: 'nowrap'}}>
        <CheckBoxField name={'is_wait'} label={canceled ? 'Отменён' : 'Не подтверждён'} checked={is_wait}
                       onChange={v => setValue({is_wait: v})}/>
      </Grid>}
    </Grid>
  )

  const fields = {
    'title': <TextField label="Название" value={title} onChange={e => setValue({title: e.target.value})} required/>,
    'money': <MoneyField />,
    'client': <ClientField client={client} set={(client) => setValue({client: client})}/>,
    'creator': <UserField value={creator_info ? creator_info : creator} label={'Заказчик'} disabled required/>,
    'folder': <FolderField value={parent} set={(parent) => setValue({parent: parent})} f={clientListStore}/>,
    'user': <UserField value={user_info ? user_info : user} label={'Подрядчик'} required set={v => setValue({user: v ? v.username : null, user_info: v})}/>
  }

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = []
  let right = []

  if (is_folder) {
    left = ['title', (<InfoField height={158}/>)]
    right = [
      <div style={{textAlign: 'center', width: '100%'}}>
        <Typography color={'secondary'} variant={'overline'}>Значения по умолчанию</Typography>
      </div>, 'money', 'client'
    ]
  }
  else if (user === creator) {
    left = ['title', 'money', 'client', 'folder', checkBoxes(true, true)]
    right = [<InfoField height={286}/>]
  }
  else if (user !== creator) {
    if (user === localStorage.User) {
      left = ['title', 'money', 'creator', checkBoxes(true, false)]
      right = [<InfoField height={278}/>]
    }
    else if (creator === localStorage.User) {
      left = ['title', 'money', 'user', 'creator']
      right = [<InfoField height={286}/>]
    }
  }

  return (
    <Grid container justify="space-between" alignItems="flex-start" spacing={3} style={{marginTop: 12}}>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {left.map((item, id) => <Grid item xs={12} key={id}>{getField(item)}</Grid>)}
        </Grid>
      </Grid>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {right.map((item, id) => <Grid item xs={12} key={id}>{getField(item)}</Grid>)}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default inject('ProjectStore')(observer(ProjectForm))
