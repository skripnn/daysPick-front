import React, {useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import {ArrowDropDown, ArrowDropUp} from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import TextLoop from "react-text-loop";
import Grid from "@material-ui/core/Grid";
import './ProjectsStatistics.css'

export default function ProjectsStatistics({statistics: value, mobile}) {
  const [open, setOpen] = useState(false)

  const textSum = new Intl.NumberFormat('ru-RU').format(value.sum) + " ₽"
  const sumPerDay = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(value.sum / value.days || 0) + " ₽ / день"

  const statistics = [
    'Проектов: ' + value.projects,
    'Дней: ' + value.days,
    'Гонорар: ' + textSum,
    'Средний гонорар: ' + sumPerDay
  ]
  const typographyProps = {
    variant: 'body2',
    color: 'secondary',
    noWrap: true
  }

  return (<>
    {mobile &&
    <div className={'projects-statistics-header'}>
      <IconButton size={'small'} onClick={() => setOpen(!open)}>
        {open ? <ArrowDropUp/> : <ArrowDropDown/>}
      </IconButton>
      {open ?
        <Typography {...typographyProps}>Статистика:</Typography> :
        <TextLoop springConfig={{stiffness: 180, damping: 8}} className={'text-loop'}>
          {statistics.map(i => <Typography {...typographyProps}>{i}</Typography>)}
        </TextLoop>
      }
    </div>
    }
    {(!mobile || open) &&
    <Grid container justify={"space-around"} className={'projects-statistics-list'}>
      {statistics.map((i, n) => (
        <Grid item xs={12} sm={6} md={'auto'} key={n}>
          <Typography {...typographyProps}>{i}</Typography>
        </Grid>
      ))}
    </Grid>
    }
  </>)
}
