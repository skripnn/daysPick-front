import Item from "./Item";
import React from "react";
import {useAccount} from "../../stores/storeHooks";
import {FolderOpen, Person} from "@material-ui/icons";

export default function ProjectItem({project, onClick=() => {}}) {

  return (
    <Item
      primary={project.title}
      secondary={project.is_self ? project.client : <><Person fontSize={"inherit"} style={{paddingRight: 4}}/>{project.client}</>}
      // action={deleteButton}
      onClick={() => onClick(project)}
    />
  )
}

export function ProjectFolderItem({project, onClick}) {
  const primary = (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <FolderOpen fontSize={"inherit"} style={{paddingRight: 4}}/>{project.title}
    </div>
  )

  let clients = [...new Set(project.children.map(p => p.client ? p.client.full_name : null))]
  if (clients.includes(null)) clients = clients.filter(v => !!v).concat([null])
  const secondary = clients.length > 1 ? clients[0] + ', ...' : clients[0]

  return (
    <Item
      primary={primary}
      secondary={secondary || '...'}
      // action={deleteButton}
      onClick={() => onClick(project)}
    />
  )
}
