import {Chip} from "@material-ui/core";
import React, {useRef} from "react";
import "./Tag.css"


export default function Tag(props) {
  const ref = useRef()
  const onTake = (e) => {
    if (!props.edit) return
    if (e.target !== ref.current && e.target !== ref.current.firstElementChild) return
    props.onTake(e, ref.current, props.tag)
  }

  return (
      <Chip
        ref={ref}
        className={'tag' + (props.edit? ' edit' : '') + (props.hidden ? ' hidden' : '')}
        variant="outlined"
        label={props.tag.title}
        onDelete={props.onDelete}
        onMouseDown={onTake}
        onTouchStart={e => onTake(e.touches[0])}
      />
  )
}
