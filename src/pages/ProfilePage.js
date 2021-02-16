import {inject, observer} from "mobx-react";
import UserProfile from "../components/UserProfile/UserProfile";
import TextField from "../components/Fields/TextField/TextField";
import {postProfile} from "../js/fetch/user";
import {useState} from "react";
import {CircularProgress, List, ListItem, ListSubheader, Snackbar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Loader from "../js/functions/Loader";

function ProfilePage(props) {
  const {first_name, last_name, positions, setValue} = props.ProfileStore
  const [loading, setLoading] = useState(false)

  function handleChange(obj) {
    setLoading(true)
    setValue(obj)
    Loader.set(() => postProfile(obj).then((r) => {
      console.log(r)
      setLoading(false)
      setValue(r)
    }))
  }

  const Loading = (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={loading}
      onClose={() => setLoading(false)}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setLoading(false)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <CircularProgress color={'inherit'} size={24}/>
    </Snackbar>
  )

  return (
    <List dense>
      <ListSubheader>Личная информация</ListSubheader>
      <ListItem>
        <TextField
          label={'Имя'}
          name={'firstname'}
          value={first_name || ''}
          onChange={(e) => handleChange({first_name: e.target.value})}
        />
      </ListItem>
      <ListItem>
        <TextField
          label={'Фамилия'}
          name={'lastname'}
          value={last_name || ''}
          onChange={(e) => handleChange({last_name: e.target.value})}
        />
      </ListItem>
      <ListSubheader>Специализации</ListSubheader>
      <ListItem>
        <UserProfile positions={positions} setValue={setValue} edit/>
      </ListItem>
      {loading && Loading}
    </List>
  )
}

export default inject(stores => ({
  ProfileStore: stores.UsersStore.getLocalUser().user
}))(observer(ProfilePage))