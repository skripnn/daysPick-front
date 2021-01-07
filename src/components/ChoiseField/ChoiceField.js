
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getClientsOptions} from "../../js/functions/fetch";
import ClientsDialog from "../Client/ClientsDialog";

const filter = createFilterOptions();


export default function ClientChoice(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [dialog, setDialog] = React.useState(null)
  const loading = open && options.length === 0;

  React.useEffect(() => {
    if (!loading) return undefined
    getClientsOptions().then(result => setOptions(result))
  }, [loading]);

  React.useEffect(() => {
    console.log(props.value)
    if (props.value && props.value.new) {
      setDialog({name: props.value.name, company: ''})
    }
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  function closeDialog() {
    props.setValue(null)
    setDialog(null)
  }

  function saveDialog(v) {
    props.setValue(v)
    setDialog(null)
  }

  console.log(props.value)
  return (
    <>
    <Autocomplete
      value={props.value}
      size={"small"}
      groupBy={option => option.company}
      onChange={(e, newValue) => props.setValue(newValue)}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        filtered.push({new: true, name: params.inputValue, company: '---'});
        return filtered;
      }}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      options={options}
      getOptionSelected={(option, value) => (option.name === value.name && option.company === value.company)}
      getOptionLabel={(option) => option.new? 'Новый заказчик': option.name}
      loading={loading}
      loadingText={'Загрузка...'}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Заказчик"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    {dialog? <ClientsDialog client={dialog} close={closeDialog} save={saveDialog}/> : undefined}
    </>
  );
}
