import React, {useEffect, useState} from "react";
import {CircularProgress, IconButton} from "@material-ui/core";
import VkIcon from "../../Icons/VkIcon";
import PropTypes from "prop-types";
import mainStore from "../../../stores/mainStore";
import {Clear} from "@material-ui/icons";

const vkId = process.env.NODE_ENV === 'production' ? 7786320 : 7802338


function VkLogin(props) {
  const {id, onClick, disabled, children, logOut, ...rest} = props
  const [loading, setLoading] = useState(!document.getElementById('vk-jssdk'))

  useEffect(() => {
    if (window.VK) window.VK.Auth.logout()
  }, [window.VK])

  useEffect(() => {
    if (!document.getElementById("vk_api_transport")) {
      const el = document.createElement('div')
      el.id = "vk_api_transport"
      document.body.appendChild(el)
    }
    if (!loading) return
    setInitAsync()
    loadSdkAsync()
  // eslint-disable-next-line
  }, [])

  function setInitAsync() {
    window.vkAsyncInit = () => {
      window.VK.init({ apiId: id });
      setLoading(false)
    };
  }

  function clear() {
    setLoading(true)
    window.VK.Auth.getLoginStatus(clearing)
  }

  function clearing(response) {
    if (!response) error('Ошибка подключения к API ВКонтакте')
    if (response.status === 'connected') window.VK.Auth.logout()
    setLoading(false)
    onClick()

  }


  function loadSdkAsync() {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://vk.com/js/api/openapi.js?139';
    el.async = true;
    el.id = 'vk-jssdk';
    document.getElementById("vk_api_transport").appendChild(el);
  }

  function onComplete(user) {
    setLoading(false)
    if (onClick) onClick(user)
  }

  function onAuth(response) {
    if (response.session) getUser()
    else error('Ошибка авторизации')
  }

  function handleClick() {
    if (loading) return
    setLoading(true);
    window.VK.Auth.getLoginStatus(test)
  }

  function getUser(id) {
    window.VK.api('users.get', {
      fields: "photo_50,domain",
      v: "5.130"
    }, (data) => {
      onComplete(data.response[0])
    })
  }

  function error(message) {
    setLoading(false);
    mainStore.InfoBarStore.add({error: message? message : 'Непредвиденная ошибка'})
  }

  function test(response) {
    if (!response) error('Ошибка подключения к API ВКонтакте')
    if (response.status === 'connected') getUser()
    else window.VK.Auth.login(onAuth);
  }

  if (!!children) return <div onClick={logOut? clear : handleClick}>{children}</div>

  return (
    <IconButton
      onClick={logOut? clear : handleClick}
      size={"small"}
      disabled={disabled || loading}
      {...rest}
    >
      {loading?
        <CircularProgress size={24} color={'inherit'}/>
        :
        (logOut? <Clear /> : <VkIcon type={'hovered'}/>)
      }
    </IconButton>
    );
}

VkLogin.propTypes = {
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  logOut: PropTypes.bool
}

VkLogin.defaultProps = {
  id: vkId
}

export default VkLogin