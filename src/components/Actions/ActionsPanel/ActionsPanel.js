import React from "react";
import './ActionsPanel.css'



function ActionsPanel(props) {
  if (props.hidden) return <></>

  if (props.bottom) return (
    <div className={'actions-panel bottom'}>
      {props.left}
      {props.right}
    </div>
  )

  return (
    <div className={'actions-panel'}>
      <div>
        {props.left}
      </div>
      <div>
        {props.right}
      </div>
    </div>
  )
}

ActionsPanel.defaulProps = {
  left: [],
  right: []
}

export default ActionsPanel