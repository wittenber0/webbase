import { BetFactorTypeEnum } from "./enum/BetFactorTypeEnum";
import Factor from "./Factor";

export default class BetFactor {
    public Label: BetFactorTypeEnum;
    public Factor: Factor;
    public LabelDetail?: string;

    public constructor(label:BetFactorTypeEnum, factor:Factor, labelDetail?:string){
        this.Label = label;
        this.Factor = factor;
        this.LabelDetail = labelDetail;
    }
}