import {FormControl, FormHelperText, Typography} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import React from "react";
import PropTypes from 'prop-types'

function CheckBoxField(props) {
  const {checked, onChange, name, label, disabled, helperText, readOnly} = props

  return (
    <FormControl>
      <FormControlLabel
        style={{height: 45}}
        labelPlacement="end"
        name={name}
        label={<Typography color={"textPrimary"}>{label}</Typography>}
        disabled={disabled}
        control={
          <Checkbox color={"default"} checked={checked} onChange={!readOnly ? e => onChange(e.target.checked) : undefined}/>
        }/>
      {!!helperText && <FormHelperText style={{marginTop: -9}}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

CheckBoxField.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  name: PropTypes.string,
  disabled: PropTypes.bool,
  helperText: PropTypes.string
}

export default CheckBoxField
