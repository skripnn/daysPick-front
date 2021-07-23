import React, {useRef, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import {MoreHoriz} from "@material-ui/icons";
import {Popover} from "@material-ui/core";

function PopoverButtonsBlock(props) {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef()
  return (
    <>
      <IconButton ref={ref} edge="end" onClick={() => setAnchorEl(ref.current)}>
        <MoreHoriz/>
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        {props.children}
      </Popover>
    </>
  )
}

export default PopoverButtonsBlock
