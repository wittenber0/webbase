import { BetFactorTypeEnum } from './enum/BetFactorTypeEnum'

export default class FactorTypeSummary{
    PickLabel: string;
    Value: number;

    constructor(pickLabel: string, value:number){
        this.PickLabel = pickLabel;
        this.Value = value;
    }
}