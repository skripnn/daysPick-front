import React from "react";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import ActionButton from "../ActionButton/ActionButton";
import {PersonAdd} from "@material-ui/icons";
import BackOrProfileActionButton from "../BackOrProfileActionButton/BackOrProfileActionButton";


function ClientsPageActionPanel(props) {

  const left = <BackOrProfileActionButton type={'profile'} history={props.history}/>

  const right = [
    <ActionButton
      key={"Добавить"}
      label={"Добавить"}
      icon={<PersonAdd/>}
      onClick={() => props.ClientsPageStore.setDialog({name: '', company: ''})}
    />,
  ]

  return (
    <ActionsPanel
      {...props}
      left={left}
      right={right}
    />
  )
}

export default inject('ClientsPageStore')(observer(ClientsPageActionPanel))