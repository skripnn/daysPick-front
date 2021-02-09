import {Route, Switch} from "react-router-dom";
import TestPageActionPanel from "./PagePanels/TestPageActionPanel";
import UserPageActionPanel from "./PagePanels/UserPageActionPanel";
import ProjectPageActionPanel from "./PagePanels/ProjectPageActionPanel";
import React from "react";

export default function ActionsSwitch(props) {
  if (!localStorage.User) return (
    <Switch>
      <Route path='/user/:username' render={() => <UserPageActionPanel {...props}/>}/>
    </Switch>
  )
  return (
    <Switch>
      <Route path='/test' render={() => <TestPageActionPanel {...props}/>}/>
      <Route path='/user/:username' render={() => <UserPageActionPanel {...props}/>}/>
      <Route path='/project' render={() => <ProjectPageActionPanel {...props}/>}/>
    </Switch>
  )
}