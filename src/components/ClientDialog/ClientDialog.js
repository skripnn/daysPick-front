import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, List, ListItem, ListItemText, ListSubheader
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {Link} from "react-router-dom";
import './ClientDialog.css'
import {inject, observer} from "mobx-react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ActionButton from "../Actions/ActionButton/ActionButton";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos, Delete, Save} from "@material-ui/icons";
import Fetch from "../../js/Fetch";


function ClientDialog(props) {
  const [state, setState] = useState(props.client || props.ClientsPageStore.dialog)

  useEffect(() => {
    if (state.id) Fetch.get(['client', state.id]).then(client => setState(client))
  // eslint-disable-next-line
  }, [])

  const fullScreen = useMediaQuery('(max-width:720px)');

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton onClick={props.close} label="Назад" icon={<ArrowBackIos/>}/>}
      right={<>
        {/* eslint-disable-next-line no-restricted-globals */}
        {state.id && <ActionButton onClick={() => {if (confirm('Удалить клиента?')) props.onDelete(state)}} label="Удалить" icon={<Delete/>}/>}
        <ActionButton onClick={() => props.onSave(state)} label="Сохранить" disabled={!state.name} icon={<Save/>}/>
      </>}
    />
  )

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={props.close}
      open={true}>
      {!fullScreen && <DialogTitle>{Actions}</DialogTitle>}
      <DialogContent style={{overflow: "hidden"}}>
        <TextField
          autoFocus={props.autoFocus}
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
        {state.projects && !!state.projects.length &&
        <List dense>
          <ListSubheader style={{background: "white"}}>Проекты</ListSubheader>
          <div style={{maxHeight: 270, overflow: "scroll"}}>
          {state.projects.map(project =>
            <Link to={`/project/${project.id}/`}>
              <ListItem button>
                <ListItemText primary={project.title}/>
              </ListItem>
            </Link>
          )}
          </div>
        </List>
        }
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}

export default inject('ClientsPageStore')(observer(ClientDialog))