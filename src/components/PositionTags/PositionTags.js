import React, {useState} from "react";
import {Chip, IconButton, InputBase} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {AddCircle} from "@material-ui/icons";
import {addPosition, deletePosition, getPosition} from "../../js/fetch/user";

function PositionTags(props) {
  const {setPositions, positions, edit} = props
  const [newChip, setNewChip] = useState(null)
  const [option, setOption] = useState('')

  function del(position) {
    deletePosition(position).then(r => {
      setPositions(r)
    })
  }

  function add() {
    if (!!newChip) addPosition(newChip).then((r) => {
      setPositions(r)
      onChange(null)
    })
  }

  function onChange(v) {
    if (v === null) {
      setNewChip(null)
      setOption(null)
    }
    else {
      const backspace = v.length < newChip.length
      setNewChip(v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
      if (!v || v.length < 3) setOption('')
      else if (!option.startsWith(v) || backspace) {
        if (!backspace) setOption('')
        getPosition(v).then(setOption)
      }
    }
  }

  return (
    <Box display={"flex"} flexWrap={'wrap'} >
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
      {newChip !== null &&
      <Chip
        style={{margin: 2}}
        variant="outlined"
        deleteIcon={<AddCircle />}
        onDelete={add}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange(null)
          if (e.key === 'Enter') add()
        }}
        label={<div style={{position: "relative"}}>
          <InputBase
            inputProps={{style: {fontSize: "0.8125rem"}}}
            autoFocus
            value={newChip}
            onChange={e => onChange(e.target.value)}
            onBlur={e => {
              if (e.target.parentElement.parentElement.parentElement.parentElement !== e.relatedTarget) onChange(null)
            }}
          />
          <InputBase
            style={{position: "absolute", left: 0, top: 0}}
            inputProps={{style: {fontSize: "0.8125rem"}}}
            disabled
            value={option}
          />
        </div>
        }
      />
      }
      {edit && newChip === null &&
      <IconButton
        size={"small"}
        style={{margin: 2, color: "rgba(0, 0, 0, 0.26)"}}
        onClick={() => setNewChip('')}
      >
        <AddCircle />
      </IconButton>
      }
      {positions.map(position => <Chip
        style={{margin: 2}}
        variant="outlined"
        label={position}
        key={position}
        onDelete={edit ? () => del(position) : undefined}/>)}
    </Box>
  )
}

export default PositionTags