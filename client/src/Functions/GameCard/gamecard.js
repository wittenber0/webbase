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
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#202020',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: '#bbbbbb',
}));

const BestItem = styled(Paper)(({ theme }) => ({
  backgroundColor: '#AFE1AF',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function getFactorLabelByBook(factorList, bookId, isUS){
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
    return(<BestItem>{display}</BestItem>)
  }else{
    return (<Item>{display}</Item>)
  }
}

function getNetEV(houseLine){
  return Math.round((1-houseLine)*10000)/100;
}

export default function GameCard(props){
  const classes = useStyles();
  return(
    <div>
      <Grid container spacing={2} style={{paddingBottom: '10px', paddingTop: '10px'}}>
        <Grid item xs={12}>
          <Typography gutterBottom variant="h5" component="div" style={{display: 'inline-block'}}>{props.gameOdd.awayName} @ {props.gameOdd.homeName}</Typography>
          <Button sx={{ml:2}} variant="outlined" size="small" color="secondary">{props.gameOdd.betType}</Button>
          <Button sx={{ml:1}} variant="outlined" size="small" color="secondary">{props.gameOdd.sport}</Button>
          <Button sx={{ml:1}} variant="outlined" size="small" color="secondary">{props.gameOdd.type}</Button>
          <Button sx={{ml:1}} variant="outlined" size="small" color="secondary">Line: {props.gameOdd.line}</Button>
        </Grid>
      </Grid>
      <Grid container spacing={.5}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>Net EV: {getNetEV(props.gameOdd.houseLine)}%</Item>
            </Grid>
            {props.myBooks.map((b) => {
              return(
                <Grid item xs={2} key={b.bookId}>
                  <Item>
                  {b.logo ? <img src={b.logo}/> :
                    <Typography>{b.bookName}</Typography>
                  }
                  </Item>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
        {Object.keys(props.gameOdd.pickFactors).map(pfLabel =>{
          return(
            <Grid item xs={12} key={pfLabel}>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Item>{pfLabel}</Item>
                </Grid>
                {props.myBooks.map((b) => {
                  return(
                    <Grid item xs={2} key={b.bookId}>
                      {getFactorLabelByBook(props.gameOdd.pickFactors[pfLabel], b.bookId, true)}
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
