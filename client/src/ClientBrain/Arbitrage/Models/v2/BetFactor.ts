import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import Factor from "./Factor";

export default class BetFactor {
    public Label: BetFactorTypeEnum;
    public Factor: Factor;

    public constructor(label:BetFactorTypeEnum, factor:Factor){
        this.Label = label,
        this.Factor = factor
    }
}