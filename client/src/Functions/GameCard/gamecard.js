import { Card, CardContent, Typography, CardActions, Grid, Paper, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from "react";

const BestTypography = styled(Typography)(({ theme }) => ({
  color: '#99ffaa'
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.dark.three,
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
  backgroundColor: theme.palette.dark.three,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  textAlign: 'left',
  color: 'white',
  height: '50px'
}));

function getEVLabel(gameOdd, evLabel){
  let ev = gameOdd.evs[evLabel];
  if(ev && gameOdd.bestEV === ev){
    return <BestTypography key={evLabel}>{gameOdd.evs[evLabel]}%</BestTypography>
  }else if(ev){
    return <Typography key={evLabel}>{gameOdd.evs[evLabel]}%</Typography>
  }
}

function getBookList(bookId){
  let bookList = [bookId];
  switch (bookId) {
    //dk pp
    case 2260:
      bookList.push(68);
      break;
    //fanduel
    case 2229:
      bookList.push(69);
      break;
    //mgm
    case 2228:
      bookList.push(75);
      break;
  }
  return bookList;
}

function getFactorLabelByBook(factorList, bookId, isUS, i){
  let validBookList = getBookList(bookId)
  let factor = factorList.find((e)=> {return validBookList.includes(e.book.bookId)});
  let display = '';
  if(factor && isUS){
    display = factor.factorLabel;
  }else if(factor && !isUS){
    display = factor.factor;
  }else{
    display = '';
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

function roundPercent(dec){
  return Math.round(dec * 10000) / 100;
}

function roundHedgeRatio(dec){
  return Math.round(dec * 100) / 100;
}

export default function GameCard(props){
  return(
    <Grid container spacing={1} sx={{mt:0.1}}>
      <Grid item xs={2.5}>
        <TeamItem>
        {props.gameOdd.betType === 'tta' ? <Typography>{props.gameOdd.awayName}</Typography> :
          <Typography>{props.gameOdd.homeName}</Typography>
        }
        {props.gameOdd.betType.slice(0,2) !== 'tt'  && <Typography>{props.gameOdd.awayName}</Typography> }
        </TeamItem>
      </Grid>
      <Grid item xs={2}>
      {props.gameOdd.betType === 'pp' ? 
        <Item>
          <Typography variant='subtitle2'>{props.gameOdd.playerPropLabel}</Typography>
          <Typography variant='subtitle2'>v: {props.gameOdd.type}</Typography>
        </Item> : 
        <Item>
          <Typography variant='subtitle2'>{props.gameOdd.betType}: {props.gameOdd.line}</Typography>
          <Typography variant='subtitle2'>v: {props.gameOdd.type}</Typography>
        </Item>
      }
        
      </Grid>
      <Grid item xs={1}>
        <Item>
          <Typography>{getNetEV(props.gameOdd.houseLine)}%</Typography>
          {(props.gameOdd.houseFactor > 0) && <Typography>{roundHedgeRatio(props.gameOdd.houseFactor)}</Typography>}
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
        {Object.keys(props.gameOdd.evs).map((evLabel, i) => {
          return getEVLabel(props.gameOdd, evLabel)
        })}
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
          {(props.gameOdd.freeBetPercent > 0) && <Typography>{roundPercent(props.gameOdd.freeBetPercent)}%</Typography>}
          {(props.gameOdd.freeBetHedgeRatio > 0) && <Typography>{roundHedgeRatio(props.gameOdd.freeBetHedgeRatio)}</Typography>}
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
        {Object.keys(props.gameOdd.pickFactors).map((pfLabel, i) => {
          return <Typography key={i}>{pfLabel}</Typography>
        })}
        </Item>
      </Grid>
      {props.myBooks.map((b) => {
        return(
          <Grid item xs key={b.bookId}>
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
