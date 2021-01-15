import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import {Add} from "@material-ui/icons";


function TestPageActionPanel(props) {
  const store = props.store

  const actions = [
    <ActionButton
      key={'int+1'}
      label={"INT+1"}
      onClick={() => store.setValue({int: store.int + 1})}
    />,
    <ActionButton
      key={'bool'}
      icon={<Add/>}
      label={"BOOL"}
      red={store.bool}
      onClick={() => store.setValue({bool: !store.bool})}
    />,
    <ActionButton
      key={'int+2 bool'}
      label={"INT+2 & BOOL"}
      onClick={() => store.setValue({bool: !store.bool, int: store.int + 2})}
    />,
  ]


  return (
    <ActionsPanel
      {...props}
      right={actions}
    />
  )
}

export default inject(stores => ({
  store: stores.TestPageStore,
  calendar: stores.Calendar
}))(observer(TestPageActionPanel))