import ClientItem from "../../ClientItem/ClientItem";
import TextField from "../TextField/TextField";
import React, {useState} from "react";
import {List} from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import {isMobil} from "../../../js/functions/functions";
import ClientChoiceDialog from "../../ClientChoiceDialog/ClientChoiceDialog";

function ClientField(props) {
  const [dialog, setDialog] = useState(null)

  function set(client) {
    props.set(client)
    setDialog(null)
  }

  function clear() {
    props.set(null)
    setDialog({
      name: '',
      company: ''
    })
  }

  return (<>
    <div style={{position: "relative"}}>
      {!!props.client &&
      <List dense style={{
        zIndex: !!props.client ? 5 : 0,
        paddingBottom: 'unset',
        paddingTop: 14,
        marginLeft: -8,
        marginRight: -8
      }}>
        <ClientItem
          disabled
          client={props.client}
          onDelete={() => props.set(null)}
          deleteIcon={<ClearIcon/>}
          noTimeout
          showCompany={!isMobil()}
        />
      </List>
      }
      <TextField
        InputLabelProps={{shrink: !!props.client, disabled: false}}
        style={!!props.client ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
        inputProps={{disabled: true, style: {cursor: 'pointer', height: 24}}}
        InputProps={{disabled: false}}
        label={'Клиент'}
        onClick={clear}
      />
    </div>
    {!!dialog &&
    <ClientChoiceDialog open={!!dialog} client={dialog || {user: '', company: ''}} set={set} close={() => setDialog(null)}/>
    }
  </>)
}


export default ClientField