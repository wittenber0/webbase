import BetFactor from "./BetFactor";
import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import Factor from "./Factor";


export default class BetChoiceFactors{
    public Label: any;
    public Factors: Factor[];

    constructor(label:any, factors:Factor[]){
        this.Label = label;
        this.Factors = factors;
    }
}