import Factor from "./factor";

export default class BetFactor {
    public Label: string;
    public Factor: Factor;

    public constructor(label, factor){
        this.Label = label,
        this.Factor = factor
    }
}