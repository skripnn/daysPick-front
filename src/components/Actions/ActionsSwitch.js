import {Route, Switch} from "react-router-dom";
import UserPageActionPanel from "./PagePanels/UserPageActionPanel";
import ProjectPageActionPanel from "./PagePanels/ProjectPageActionPanel";
import React from "react";
import ClientsPageActionPanel from "./PagePanels/ClientsPageActionPanel";
import ProjectsPageActionPanel from "./PagePanels/ProjectsPageActionPanel";

export default function ActionsSwitch(props) {
  if (!localStorage.User) return (
    <Switch>
      <Route path='/user/:username' render={() => <UserPageActionPanel {...props}/>}/>
    </Switch>
  )
  return (
    <Switch>
      <Route path='/clients/' render={() => <ClientsPageActionPanel {...props}/>}/>
      <Route path='/projects/' render={() => <ProjectsPageActionPanel {...props}/>}/>
      <Route path='/user/:username' render={() => <UserPageActionPanel {...props}/>}/>
      <Route path='/project/' render={() => <ProjectPageActionPanel {...props}/>}/>
      <Route path={'/:prefix([@]):username([0-9a-z]*)/'} render={() => <UserPageActionPanel {...props}/>}/>
    </Switch>
  )
}
