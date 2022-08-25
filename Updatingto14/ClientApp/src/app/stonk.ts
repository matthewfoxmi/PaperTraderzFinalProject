
export interface Stonk {
    count:   number;
    status:  string;
    tickers: Ticker[];
}

export interface Ticker {
    day:              Day;
    min:              Day;
    prevDay:          Day;
    ticker:           string;
    todaysChange:     number;
    todaysChangePerc: number;
    updated:          number;
}

export interface Day {
    c:   number;
    h:   number;
    l:   number;
    o:   number;
    v:   number;
    vw:  number;
    av?: number;
}
