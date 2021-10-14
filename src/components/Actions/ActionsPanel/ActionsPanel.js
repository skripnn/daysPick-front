import React from "react";
import './ActionsPanel.css'
import ActionButton, {BackActionButton} from "../ActionButton/ActionButton";
import {useMobile} from "../../hooks";

export function ActionsPanel2({left, children, right}) {
  if (right) {
    if (!Array.isArray(right)) right = right.props.children.filter(i => !!i)
    else right = right.filter(i => !!i)
    while (right.length < 3) {
      right.unshift(<ActionButton empty/>)
    }
  }
  const isMobile = useMobile()

  return (
    <div className={'actions-panel'}>
      {!isMobile && <div>
        {left || (!!right && <BackActionButton returnEmpty/>)}
      </div>}
      {(!!children || (right && isMobile)) && <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center', alignSelf: "flex-start"}}>
        {children}
        {!!right && <>
          <BackActionButton returnEmpty/>
          {right.map((i, n) => React.cloneElement(i, {key: n.toString()}))}
        </>}
      </div>}
      {!isMobile && <div>
        {right}
      </div>}
    </div>
  )
}


function ActionsPanel({hidden, left, center, right, bottom, children}) {
  if (hidden) return <>{children}</>

  if (bottom) return (<>
    {children}
    <div className={'actions-panel bottom2'}>
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
