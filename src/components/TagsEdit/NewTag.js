import {Box, Chip, IconButton, InputBase} from "@material-ui/core";
import {AddCircle, ClearOutlined} from "@material-ui/icons";
import React from "react";
import {category} from "../Tag/Tag";

export default function NewTag(props) {

  return (props.tag ?
      <Chip
        style={{margin: 2}}
        variant="outlined"
        deleteIcon={props.tag.title ? <AddCircle/> : <ClearOutlined/>}
        onDelete={props.tag.title ? props.addTag : () => props.setTag(null)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') props.setTag(null)
          if (e.key === 'Enter') props.addTag()
        }}
        label={<Box display={'flex'} alignItems={'center'}>
          {category(props.category)}
          <InputBase
            inputProps={{style: {fontSize: "0.8125rem"}}}
            autoFocus
            value={props.tag.title}
            onChange={e => props.setTag(prevState => ({...prevState, title: e.target.value}))}
          />
        </Box>
        }
      /> : <IconButton
        size={"small"}
        style={{margin: 2, color: "rgba(0, 0, 0, 0.26)"}}
        onClick={() => props.setTag({title: '', category: props.category})}
      >
        <AddCircle/>
      </IconButton>
  )
}