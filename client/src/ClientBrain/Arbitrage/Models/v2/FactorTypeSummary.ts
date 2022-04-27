import { BetFactorTypeEnum } from './enum/BetFactorTypeEnum'

export default class FactorTypeSummary{
    PickLabel: BetFactorTypeEnum;
    Value: number;

    constructor(pickLabel: BetFactorTypeEnum, value:number){
        this.PickLabel = pickLabel;
        this.Value = value;
    }
}