
import UtilityService from './utility-service';
const betOnlinePlayerProps = 'https://bv2.digitalsportstech.com/api/dfm/marketsBySs?sb=betonline&gameId=157002&statistic=Hits'

export default class BetOnlineService {
    static getPlayerPropsByGameAndStat = async function(boGameId:number, boStat:string){
        return UtilityService.get(betOnlinePlayerProps+boGameId+'&statistic='+boStat);
      }
}