import {List} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import HeaderText from "../Text/HeaderText";
import React from "react";
import {useControlledState} from "../hooks";

function Tabs({activeTab, setActiveTab, children}) {
  const [active, setActive] = useControlledState(activeTab, setActiveTab)

  return (
    <List dense>
      <Box display={'flex'} justifyContent={'space-around'}>
        {children.map((tab) => <HeaderText button key={tab.id} id={tab.id} activeTab={active} setTab={setActive}>{tab.label}</HeaderText>)}
      </Box>
      {children.find(tab => tab.id === active).content}
    </List>
  )
}

Tabs.defaultProps = {
  children: []
}

export default Tabs
