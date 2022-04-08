import { Card, CardContent, Typography, CardActions, Button, Grid, Paper, Divider } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import React from "react";

const useStyles = makeStyles(theme =>({
  list: {
    width: 250
  },
  fullList: {
    width: 'auto',
  },
  cardPaper: {
    backgroundColor: theme.palette.dark.two,
    color: '#cccccc'
  },
  icon:{
    color: theme.palette.common.white
  },
  divderColor: {
    background: '#202020'
  },
  accentTextColor: {
    color: theme.palette.secondary
  },
  whiteText: {
    color: '#202020'
  }
}));

const BestTypography = styled(Typography)(({ theme }) => ({
  color: '#99ffaa'
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#202020',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  alignItems:'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  color: '#aaaaaa',
  height: '50px'
}));

const TeamItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#202020',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  textAlign: 'left',
  color: '#aaaaaa',
  height: '50px'
}));

function getFactorLabelByBook(factorList, bookId, isUS, i){
  let factor = factorList.find((e)=> {return e.book.bookId === bookId});
  let display = '';
  if(factor && isUS){
    display = factor.factorLabel;
  }else if(factor && !isUS){
    display = factor.factor;
  }else{
    display = 'N/A';
  }
  if(factor && factor.best){
    return(<BestTypography key={i}>{display}</BestTypography>)
  }else{
    return (<Typography key={i}>{display}</Typography>)
  }
}

function getNetEV(houseLine){
  return Math.round((1-houseLine)*10000)/100;
}

export default function GameCard(props){
  const classes = useStyles();
  return(
    <Grid container spacing={1} sx={{mt:0.1}}>
      <Grid item xs={2}>
        <TeamItem>
          <Typography>{props.gameOdd.homeName}</Typography>
          <Typography>{props.gameOdd.awayName}</Typography>
        </TeamItem>
      </Grid>
      <Grid item xs={1}>
        <Item>
          <Typography variant='subtitle2'>{props.gameOdd.betType}: {props.gameOdd.line}</Typography>
          <Typography variant='subtitle2'>v: {props.gameOdd.type}</Typography>
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
          <Typography>{getNetEV(props.gameOdd.houseLine)}%</Typography>
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
          <Typography>EV:</Typography>
          <Typography>EV:</Typography>
        </Item>
      </Grid>
      {props.myBooks.map((b) => {
        return(
          <Grid item xs={1.5} key={b.bookId}>
            <Item>
            {Object.keys(props.gameOdd.pickFactors).map((pfLabel, i) => {
              return getFactorLabelByBook(props.gameOdd.pickFactors[pfLabel], b.bookId, true, i)
            })}
            </Item>
          </Grid>
        );
      })}
    </Grid>
  )
}
