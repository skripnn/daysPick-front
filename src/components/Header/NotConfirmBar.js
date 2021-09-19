import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Fetch from "../../js/Fetch";
import React from "react";
import {useAccount} from "../../stores/storeHooks";

export function NotConfirmBar() {
  const is_confirmed = useAccount().is_confirmed
  if (is_confirmed) return null

  return (
    <Toolbar variant={"dense"} className={'header-info-text'}>
      <Typography variant={'body2'} onClick={() => Fetch.link('settings')}>Требуется подтверждение аккаунта</Typography>
    </Toolbar>
  )
}
