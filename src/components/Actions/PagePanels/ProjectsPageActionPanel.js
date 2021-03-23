import React from "react";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import ActionButton from "../ActionButton/ActionButton";
import {PostAdd} from "@material-ui/icons";
import BackOrProfileActionButton from "../BackOrProfileActionButton/BackOrProfileActionButton";


function ProjectsPageActionPanel(props) {

  const left = <BackOrProfileActionButton type={'profile'} />

  const right = [
    <ActionButton
      key={'Добавить'}
      label={'Добавить'}
      icon={<PostAdd/>}
      link={'project'}
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

export default ProjectsPageActionPanel