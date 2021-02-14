import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import {getClients} from "../../../js/fetch/client";
import {inject, observer} from "mobx-react";
import ClientDialog from "../../ClientDialog/ClientDialog";

const filter = createFilterOptions();


function ChoiceField(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [dialog, setDialog] = React.useState(null)
  const loading = open && options.length === 0;
  const setValue = (value) => props.ProjectStore.setValue({client: value})
  const {client } = props.ProjectStore


  React.useEffect(() => {
    if (!loading) return undefined
    getClients().then(result => setOptions(result))
  }, [loading]);

  React.useEffect(() => {
    if (client && client.new) {
      setDialog({name: client.name, company: ''})
    }
    if (!open) {
      setOptions([]);
    }
  // eslint-disable-next-line
  }, [open]);

  function closeDialog() {
    setValue(null)
    setDialog(null)
  }

  function saveDialog(v) {
    setValue(v)
    setDialog(null)
  }

  return (
    <>
    <Autocomplete
      value={client}
      size={"small"}
      groupBy={option => option.company}
      onChange={(e, newValue) => setValue(newValue)}
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
      getOptionLabel={(option) => option.new? 'Новый клиент': option.name}
      loading={loading}
      loadingText={'Загрузка...'}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Клиент"
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
    {dialog? <ClientDialog autoFocus client={dialog} close={closeDialog} save={saveDialog}/> : undefined}
    </>
  );
}

export default inject('ProjectStore')(observer(ChoiceField))