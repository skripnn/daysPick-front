import {Box, FormControl, IconButton, InputLabel, Select} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {Clear} from "@material-ui/icons";

function CategoryFilter(props) {
  const [select, setSelect] = useState(props.select || 0)

  function handleChange(e) {
    const v = e? e.target.value : 0
    props.setSelect? props.setSelect(v > 0? v : null) : setSelect(v)
  }

  useEffect(() => {
    setSelect(props.select || 0)
  }, [props.select])

  return (
    <Box style={{paddingTop: 2}} display={'flex'} alignItems={'flex-end'}>
      <FormControl fullWidth>
        <InputLabel shrink={select > 0}>Категория</InputLabel>
        <Select
          native
          value={select || 0}
          onChange={handleChange}
          style={{minWidth: 200}}
        >
          <option value={0}/>
          <option value={1}>Звук</option>
          <option value={2}>Свет</option>
        </Select>
      </FormControl>
      {select > 0 &&  <IconButton onClick={() => handleChange()} size={'small'}>
        <Clear/>
      </IconButton> }
    </Box>
  )
}

export default CategoryFilter