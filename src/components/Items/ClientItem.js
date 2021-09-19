import Fetch from "../../js/Fetch";
import DeleteIcon from "@material-ui/icons/Delete";
import {Avatar} from "@material-ui/core";
import React from "react";
import FetchIconButton from "../core/FetchIconButton";
import Item from "./Item";

export function ClientItem({client, onClick=() => {}, onDelete=() => {}}) {

  const deleteButton = (
    <FetchIconButton
      edge="end"
      size={'small'}
      confirmText={'Удалить клиента?'}
      fetch={ () => Fetch
        .delete(['client', client.id])
        .then(() => onDelete(client))
      }
    >
      <DeleteIcon/>
    </FetchIconButton>
  )

  return (
    <Item
      avatar={<Avatar style={{zoom: 0.7}}>{client.name[0].toUpperCase()}</Avatar>}
      primary={client.name}
      // secondary={client.company}
      action={deleteButton}
      onClick={() => onClick(client)}
    />
  )
}

