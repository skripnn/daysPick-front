import React from "react";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import ActionButton from "../ActionButton/ActionButton";
import {PostAdd} from "@material-ui/icons";


function ProjectsPageActionPanel(props) {


  const right = [
    <ActionButton
      key={'Добавить'}
      label={'Добавить'}
      icon={<PostAdd/>}
      link={'/project/'}
    />,
  ]

  return (
    <ActionsPanel
      {...props}
      right={right}
    />
  )
}

export default ProjectsPageActionPanel