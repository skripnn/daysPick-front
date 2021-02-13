import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, Divider, List, ListItem, ListItemText, ListSubheader
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import Button from "@material-ui/core/Button";
import {getClient, getClients, postClient} from "../../js/fetch/client";
import {Link} from "react-router-dom";
import './ClientDialog.css'
import {inject, observer} from "mobx-react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import {Close} from "@material-ui/icons";


function ProjectList(props) {
  if (!props.projects.length) return null
  const subheader = <ListSubheader style={{background: "white"}}>Проекты</ListSubheader>
  return (
      <List dense subheader={subheader} style={{maxHeight: 300, overflow: "scroll"}}>
        {props.projects.map(project =>
          <Link to={`/project/${project.id}/`}>
            <ListItem button>
              <ListItemText primary={project.title}/>
            </ListItem>
          </Link>
        )}
      </List>
  )
}

function ClientDialog(props) {
  const [state, setState] = useState(props.client || props.ClientsPageStore.dialog)

  useEffect(() => {
    if (state.id) getClient(state.id).then(client => setState(client))
  }, [])

  function save() {
    postClient(state).then((result) => {
      props.ClientsPageStore.saveClient(result)
      getClients().then(result => props.ClientsPageStore.setClients(result))
      if (props.save) props.save(result)
      props.ClientsPageStore.setDialog(null)
    })
  }

  function close() {
    if (props.close) props.close()
    props.ClientsPageStore.setDialog(null)
  }

  const fullScreen = useMediaQuery('(max-width:720px)');

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={close}
      open={true}>
      <DialogTitle>Клиент</DialogTitle>
      <DialogContent style={{overflow: "hidden"}}>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Имя"
          value={state.name || ''}
          onChange={(e) => setState(prevState => ({...prevState, name: e.target.value}))}
        />
        <TextField
          margin="dense"
          name="company"
          label="Компания"
          value={state.company || ''}
          onChange={(e) => setState(prevState => ({...prevState, company: e.target.value}))}
        />
        {state.projects && <ProjectList projects={state.projects}/>}
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Отмена
        </Button>
        <Button onClick={save} color="primary" disabled={!state.name}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default inject('ClientsPageStore')(observer(ClientDialog))