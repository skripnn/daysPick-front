import React, {useRef, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import {MoreHoriz} from "@material-ui/icons";
import {Popover} from "@material-ui/core";

function PopoverButtonsBlock({children, icon}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef()
  return (
    <>
      <IconButton ref={ref} edge="end" onClick={() => setAnchorEl(ref.current)} size={'small'}>
        {icon}
      </IconButton>
      <Popover
        marginThreshold={0}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        {children}
      </Popover>
    </>
  )
}

PopoverButtonsBlock.defaulProps = {
  icon: <MoreHoriz/>
}

export default PopoverButtonsBlock
