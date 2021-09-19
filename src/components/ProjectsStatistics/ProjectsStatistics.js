import React from "react";
import Typography from "@material-ui/core/Typography";
import './ProjectsStatistics.css'
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import CloseButton from "../CloseButton/CloseButton";

export function StatisticsDialog({value, close}) {

  const typographyProps = {
    variant: 'body2',
    color: 'secondary',
    noWrap: true
  }

  const statistics = value ? [
    'Проектов: ' + value.projects,
    'Дней: ' + value.days,
    'Гонорар: ' + new Intl.NumberFormat('ru-RU').format(value.sum) + " ₽",
    'Средний гонорар: ' + new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value.sum / value.days || 0) + " ₽ / день"
  ] : []

  return (
    <Dialog
      maxWidth={'xs'}
      onClose={close}
      open={!!value}
      fullWidth
    >
      <DialogTitle>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
          <Typography>{'Статистика'}</Typography>
          <CloseButton onClick={close}/>
        </div>
      </DialogTitle>
      {!!value &&
        <DialogContent>
          {!value.projects ?
            <Typography {...typographyProps}>Нет проектов</Typography> :
            statistics.map((i, n) => (
            <Typography {...typographyProps} key={n.toString()}>{i}</Typography>
          ))}
        </DialogContent>
      }
    </Dialog>
  )
}
