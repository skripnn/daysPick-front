import React, {useEffect, useState} from "react";
import {CircularProgress, IconButton} from "@material-ui/core";
import VkIcon from "../../Icons/VkIcon";
import PropTypes from "prop-types";

function VkLogin(props) {
  const {id, onClick, disabled, children, ...rest} = props
  const [loading, setLoading] = useState(!document.getElementById('vk-jssdk'))

  useEffect(() => {
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

  function loadSdkAsync() {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.src = 'https://vk.com/js/api/openapi.js?139';
    el.async = true;
    el.id = 'vk-jssdk';
    document.getElementsByTagName('head')[0].appendChild(el);
  }

  function onComplete(user) {
    setLoading(false)
    if (onClick) onClick(user)
  }

  function processing(response) {
    if (!response.session) onComplete(null)
    if (response.session) {
      const user = response.session.user
      window.VK.api('users.get', {
        user_ids: `${user.id}`,
        fields: "photo_50,email",
        v: "5.130"
      }, (data) => onComplete((data.response && data.response.length)? {...user, picture: data.response[0]['photo_50']}: user))
    }
  }

  function handleClick() {
    if (loading) return
    setLoading(true);
    window.VK.Auth.login(processing);
  }

  return (<>
    {children? <div onClick={handleClick}>{children}</div> :
    <IconButton
      onClick={handleClick}
      size={"small"}
      disabled={disabled || loading}
      {...rest}
    >
      {loading?
        <CircularProgress size={24} color={'inherit'}/>
        :
        <VkIcon type={'hovered'}/>
      }
    </IconButton>}
    </>);
}

VkLogin.propTypes = {
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func
}

export default VkLogin