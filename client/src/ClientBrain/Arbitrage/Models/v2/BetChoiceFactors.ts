import BetFactor from "./BetFactor";
import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import Factor from "./Factor";


export default class BetChoiceFactors{
    public Label: BetFactorTypeEnum;
    public Factors: Factor[];

    constructor(label:BetFactorTypeEnum, factors:Factor[]){
        this.Label = label;
        this.Factors = factors;
    }
}