import React, {useState} from "react";
import Loader from "../../js/Loader";
import {IconButton, InputAdornment, ListItem} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {Call, Mail} from "@material-ui/icons";

export default function Contacts({user}) {
  const [copied, setCopied] = useState(null)

  const p = user.phone_confirm
  const phone = p ? `+${p[0]} (${p.slice(1, 4)}) ${p.slice(4, 7)}-${p.slice(7, 9)}-${p.slice(9)}` : p

  function copyToClipboard(string, label) {
    let textarea;
    let result;

    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }
    setCopied(label)
    Loader.set(() => setCopied(null), 1500)
    return true;
  }

  return (<>
    {(user.show_phone && phone) && <ListItem className={'contacts-list-item'}>
      <TextField
        fullWidth={false}
        onClick={() => copyToClipboard(phone, 'phone')}
        value={phone}
        label={copied === 'phone' ? 'Скопировано' : 'Телефон'}
        inputProps={{style: {cursor: 'pointer', paddingBottom: 5, paddingTop: 5}}}
        onFocus={e => e.target.blur()}
        InputProps={{
          disableUnderline: true, startAdornment:
            <InputAdornment position={'start'} style={{marginRight: 0}}>
              <a href={`tel:+${phone}`}>
                <IconButton size={'small'}>
                  <Call/>
                </IconButton>
              </a>
            </InputAdornment>
        }}
      />
    </ListItem>}

    {(user.show_email && user.email_confirm) && <ListItem className={'contacts-list-item'}>
      <TextField
        fullWidth={false}
        onClick={() => copyToClipboard(user.email_confirm, 'email')}
        value={user.email_confirm}
        label={copied === 'email' ? 'Скопировано' : 'E-mail'}
        inputProps={{style: {cursor: 'pointer', paddingBottom: 5, paddingTop: 5}}}
        onFocus={e => e.target.blur()}
        InputProps={{
          disableUnderline: true, startAdornment:
            <InputAdornment position={'start'} style={{marginRight: 0}}>
              <a href={`mailto:${user.email_confirm}`}>
                <IconButton size={'small'}>
                  <Mail/>
                </IconButton>
              </a>
            </InputAdornment>
        }}
      />
    </ListItem>}
  </>)
}
