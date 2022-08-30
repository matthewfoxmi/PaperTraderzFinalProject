import { Stonk } from "./stonk";
import { User } from "./user";

export interface InvestedStock {
    id: number;
    investedTicker: string;
    purchasePrice: number;
    userId: number;
    sharesOwned: number;
    investedTickerNavigation: Stonk;
    user: User;
}
