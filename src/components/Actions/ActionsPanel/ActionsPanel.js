import React from "react";
import './ActionsPanel.css'



function ActionsPanel({hidden, left, center, right, bottom, children}) {
  if (hidden) return <>{children}</>

  if (bottom) return (<>
    {children}
    <div className={'actions-panel bottom'}>
      {left}
      {center}
      {right}
    </div>
  </>)

  return (<>
    <div className={'actions-panel'}>
      <div>
        {left}
      </div>
      {!!center && <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignSelf: "flex-start"}}>
        {center}
      </div>}
      <div>
        {right}
      </div>
    </div>
    {children}
  </>)
}

ActionsPanel.defaulProps = {
  left: [],
  right: []
}

export default ActionsPanel
