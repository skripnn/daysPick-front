import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, List, ListItem, ListItemText, ListSubheader
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {getClient} from "../../js/fetch/client";
import {Link} from "react-router-dom";
import './ClientDialog.css'
import {inject, observer} from "mobx-react";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ActionButton from "../Actions/ActionButton/ActionButton";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos, Clear, Save} from "@material-ui/icons";


function ClientDialog(props) {
  const [state, setState] = useState(props.client || props.ClientsPageStore.dialog)

  useEffect(() => {
    if (state.id) getClient(state.id).then(client => setState(client))
  // eslint-disable-next-line
  }, [])

  const fullScreen = useMediaQuery('(max-width:720px)');

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton onClick={props.close} label="Назад" icon={<ArrowBackIos/>}/>}
      right={<>
        <ActionButton onClick={() => props.onDelete(state)} label="Удалить" icon={<Clear/>}/>
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
        <List dense style={{maxHeight: 300, overflow: "scroll"}}>
          <ListSubheader style={{background: "white"}}>Проекты</ListSubheader>
          {state.projects.map(project =>
            <Link to={`/project/${project.id}/`}>
              <ListItem button>
                <ListItemText primary={project.title}/>
              </ListItem>
            </Link>
          )}
        </List>
        }
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}

export default inject('ClientsPageStore')(observer(ClientDialog))