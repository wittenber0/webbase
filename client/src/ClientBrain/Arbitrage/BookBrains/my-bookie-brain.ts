import * as cheerio from 'cheerio';

import ArbitrageService from '../../../Shared/arbitrage-service';
import { BetFactorTypeEnum } from '../Models/v2/enum/BetFactorTypeEnum';
import { BetTypeEnum } from '../Models/v2/enum/BetTypeEnum';
import { PlayerPropTypeEnum } from '../Models/v2/enum/PlayerPropTypeEnum';
import { SportEnum } from '../Models/v2/enum/SportEnum';
import Factor from '../Models/v2/Factor';
import Participant from '../Models/v2/Participant';
import { BetDuration } from '../Models/v2/enum/BetDuration';
import Book from '../Models/v2/Book';
import BookBet from '../Models/v2/BookBet';
import BookEvent from '../Models/v2/BookEvent';
import BookManager from '../book-manager';
import BetFactor from '../Models/v2/BetFactor';
import BettingEvent from '../Models/v2/BettingEvent';

export default class MyBookieBrain {
    BASE_URL = "https://www.mybookie.ag/sportsbook"

    constructor(){
    }

    async loadSport(sportId: string) {


        let options = {
            "headers": {
                // ":authority:": "www.mybookie.ag",
                // ":method:": "GET",
                // ":path:": "/sportsbook/mlb/",
                // ":scheme:": "https",
                // "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "cookie": "sportsbook_time_zone=51;",
                "Origin": "https://www.mybookie.ag",
                "referer": "https://www.mybookie.ag/sportsbook/",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
            },
            "method": "GET",
          }
          console.log(options);
        fetch(`${this.BASE_URL}/mlb`, options).then((res:any)=>{
            console.log(res);
            // Load HTML we fetched in the previous line
            // const $ = cheerio.load(res);
          }).catch((err)=>{
              console.log("HERE", err)
            return(false);
          });

        return true;
        

    }

    async getGameTree(){
        let allBookEvents:BookEvent[] = [];
        let sportsToLoad = [
          this.loadSport('baseball'),
        ];
        return await Promise.all(sportsToLoad).then(sportTrees => {
            sportTrees.forEach( st => {
              Array.prototype.push.apply(allBookEvents, st);
            });
            return allBookEvents;
        });
    }

    getOddsFromGame(gameId: any, game: any, dateString: string, betParticipants: Participant[]) {
    
    }

    //for type 'game' games id will be of format 'game|league|homeName|awayName|YYYYMMDD'
    getGameId(game: any, dateString: string, league: any){
        
    }

    getDateString(s: any){
        
    }
}