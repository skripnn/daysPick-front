import React from "react";
import './ProjectList.css'
import {
  List,
  ListSubheader
} from "@material-ui/core";
import ProjectItem from "../ProjectItem/ProjectItem";

export default function ProjectsList(props) {

  return (
      <List dense>
        <ListSubheader disableSticky className={"project-list-head"}>{props.title || "Мои проекты"}</ListSubheader>
        {props.projects.map(project => <ProjectItem
          project={project}
          key={project.id}
          onClick={() => props.onClick(project)}
          onDelete={props.onDelete}
          paidToggle={props.paidToggle}

          onTouchHold={!!props.onTouchHold? (() => props.onTouchHold(Object.keys(project.days))) : undefined}
          onTouchEnd={props.onTouchEnd}
          onMouseOver={!!props.onMouseOver? (() => props.onMouseOver(Object.keys(project.days))) : undefined}
          onMouseLeave={props.onMouseLeave}

        />)}
      </List>
  )
}

