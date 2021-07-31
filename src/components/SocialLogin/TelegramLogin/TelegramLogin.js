import React, {useState} from "react";
import Info from "../../../js/Info";
import IconButton from "@material-ui/core/IconButton";
import {CircularProgress} from "@material-ui/core";
import TelegramIcon from "../../Icons/TelegramIcon";
import Button from "@material-ui/core/Button";
import TelegramLoginButton from "react-telegram-login";
import './TelegramLogin.css'
import Keys from "../../../js/Keys";

export default function TelegramLogin(props) {
  const {loading, icon, ...rest} = props
  const [hover, setHover] = useState(false)

  const handleClick = () => {
    window.Telegram.Login.auth(
      { bot_id: Keys.telegramBotId, request_access: true },
      (data) => {
        if (!data) {
          Info.error('Ошибка авторизации')
          return
        }
        props.onClick(data)
      }
    );
  }

  if (icon) return (
    <IconButton
      size={"small"}
      onClick={props.onClick}
      disabled={props.disabled || loading}
      {...rest}
    >
      {loading ?
        <CircularProgress size={24} color={'inherit'}/>
        :
        <TelegramIcon type={'hovered'}/>
      }
    </IconButton>
  )

  return (<>
    <Button
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      style={{zoom: 0.8}}
      variant={"text"}
      color={'secondary'}
      size={"small"}
      fullWidth
      onClick={handleClick}
      disabled={props.disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color={'inherit'}/> : <TelegramIcon type={hover? 'solid' : undefined}/>}
    >
      Продолжить с Telegram
    </Button>
    <TelegramLoginButton dataOnauth={props.onClick} botName="dayspick_bot" className={'tg-button-hidden'} />
  </>)
}
