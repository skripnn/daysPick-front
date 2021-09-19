import Item from "../../Items/Item";
import {Avatar, ListSubheader} from "@material-ui/core";
import {convertClients} from "../../../js/functions/functions";
import ItemField from "./ItemField";
import ClientDialog from "../../ClientDialog/ClientDialog";
import React from "react";

export default function ClientField({label, value, onChange, ...otherProps}) {
  const itemRender = (v) => (
    <Item
      avatar={<Avatar style={{zoom: 0.75}}>{v.name[0].toUpperCase()}</Avatar>}
      primary={v.name}
    />
  )
  const listRender = (list) => convertClients(list).map(i => (
    <div key={i.company}>
      <ListSubheader disableSticky>{i.company || ' '}</ListSubheader>
      {i.clients.map(v =>
        <Item
          key={v.id.toString()}
          avatar={<Avatar style={{zoom: 0.75}}>{v.name[0].toUpperCase()}</Avatar>}
          primary={v.name}
          onClick={() => onChange(v)}
        />
      )}
    </div>
  ))


  return (
    <ItemField
      label={label}
      value={value}
      onChange={onChange}
      itemRender={itemRender}
      getLink={'clients'}
      emptyLoading
      listRender={listRender}
      createDialog={<ClientDialog onSave={onChange}/>}
      {...otherProps}
    />
  )
}
