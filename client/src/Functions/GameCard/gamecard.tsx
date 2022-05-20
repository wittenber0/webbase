import { Card, CardContent, Typography, CardActions, Grid, Paper, Divider, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from "react";
import BetChoice from '../../ClientBrain/Arbitrage/Models/v2/BetChoice';
import BetChoiceFactors from '../../ClientBrain/Arbitrage/Models/v2/BetChoiceFactors';

import Book from '../../ClientBrain/Arbitrage/Models/v2/Book'
import { BetDuration } from '../../ClientBrain/Arbitrage/Models/v2/enum/BetDuration';
import { BetFactorTypeEnum } from '../../ClientBrain/Arbitrage/Models/v2/enum/BetFactorTypeEnum';
import { BetTypeEnum } from '../../ClientBrain/Arbitrage/Models/v2/enum/BetTypeEnum';
import Factor from '../../ClientBrain/Arbitrage/Models/v2/Factor';
import FactorTypeSummary from '../../ClientBrain/Arbitrage/Models/v2/FactorTypeSummary';
import Participant from '../../ClientBrain/Arbitrage/Models/v2/Participant';

const BestTypography = styled(Typography)(({ theme }) => ({
  color: '#99ffaa'
}));

const Item = styled(Paper)(({ theme }: any) => ({
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

const TeamItem = styled(Paper)(({ theme }: any) => ({
  backgroundColor: theme.palette.dark.three,
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  textAlign: 'left',
  color: 'white',
  height: '50px'
}));

function getEVLabel(betChoice: BetChoice, evSummary: FactorTypeSummary){
  if(evSummary && betChoice.BestEV === evSummary.Value){
    return <BestTypography key={evSummary.PickLabel}>{evSummary.Value}%</BestTypography>
  }else if(evSummary){
    return <Typography key={evSummary.PickLabel}>{evSummary.Value}%</Typography>
  }
}

function getFactorLabelByBook(factorList: Factor[], bookId: number, isUS: Boolean, i: number){
  let factor = factorList.find((e)=> {return e.Book.BookId === bookId});
  let display = '';
  if(factor && isUS){
    display = factor.AmericanOdds.toString();
  }else if(factor && !isUS){
    display = factor.DecimalOdds.toString();
  }else{
    display = 'N/A';
  }
  if(factor && factor.Best){
    return(<BestTypography key={i}>{display}</BestTypography>)
  }else{
    return (<Typography key={i}>{display}</Typography>)
  }
}

function getNetEV(houseLine?: number){
  if(houseLine){
    return Math.round((1-houseLine)*10000)/100;
  }
}

function getBetParticipants(betParticipants: Participant[]){
  betParticipants.map((p,i) => {
    return <Typography key={i}>{p.Name}</Typography>
  })
}

type Props = {
  betChoice: BetChoice,
  myBooks: any
}

export default function GameCard(props: Props){
  return(
    <Grid container spacing={1} sx={{mt:0.1}}>
      <Grid item xs={2.5}>
        <TeamItem>
          <Typography>{props.betChoice.BetParticipants.find(p => p.Id === 'home')?.Name}</Typography>
          <Typography>{props.betChoice.BetParticipants.find(p => p.Id === 'away')?.Name}</Typography>
        </TeamItem>
      </Grid>
      <Grid item xs={1.5}>
        <Item>
          <Typography variant='subtitle2'>{BetTypeEnum[props.betChoice.BetType]}: {props.betChoice.Line}</Typography>
          <Typography variant='subtitle2'>v: {BetDuration[props.betChoice.BetDuration]}</Typography>
          
        </Item>
      </Grid>
      <Grid item xs={1}>
        <Item>
          <Typography>{getNetEV(props.betChoice.HouseLine)}%</Typography>
        </Item>
      </Grid>
      <Grid item xs={1}>
        {props.betChoice.Evs ? 
          <Item>
          {props.betChoice.Evs.map((evLabel) => {
            return getEVLabel(props.betChoice, evLabel)
          })}
          </Item>
        :
          <Item>
            <Typography>N/A</Typography>
          </Item>
        }
        
      </Grid>
      <Grid item xs={1}>
        <Item>
          {props.betChoice.Choices.map((c, i) => {
            return <Typography key={i}>{BetFactorTypeEnum[c.Label]}</Typography>
          })}
        </Item>
      </Grid>
      {props.myBooks.map((b: Book) => {
        return(
          <Grid item xs key={b.BookId}>
            <Item>
              {props.betChoice.Choices.map((c, i) => {
                return getFactorLabelByBook(c.Factors, b.BookId, true, i)
              })}
            </Item>
          </Grid>
        );
      })}
    </Grid>
  )
}
