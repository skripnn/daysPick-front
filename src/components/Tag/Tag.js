import {Box, Chip} from "@material-ui/core";
import {AddCircle, EmojiObjectsOutlined, RemoveCircle, VolumeUpOutlined} from "@material-ui/icons";
import React from "react";

export default function Tag(props) {
  console.log(props)
  const {tag, onClick, exist, ...newProps} = props

  const label = (<Box display={'flex'} alignItems={'center'}>
    {category(tag.category)}{tag.title}
  </Box>)

  return (<Chip
    style={{margin: 2}}
    variant="outlined"
    deleteIcon={onClick? (exist? <RemoveCircle /> : <AddCircle />) : undefined}
    onDelete={onClick? () => onClick(tag) : undefined}
    label={label}
    {...newProps}
  />)
}

export const category = (category) => {
  if (!category) return null
  return <Box display={'flex'} alignItems={'center'} style={{zoom: 0.9, marginRight: 5, color: "rgba(0, 0, 0, 0.26)"}}>{categoryIcon(category)}</Box>
}

export const categoryIcon = (category) => {
  if (category === 1) return <VolumeUpOutlined />
  if (category === 2) return <EmojiObjectsOutlined />
  return null
}