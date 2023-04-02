type TimeSeriesData = Array<[number, number]>

export type CryptoDaily = {
  prices: TimeSeriesData,
  market_caps: TimeSeriesData,
  total_volumes: TimeSeriesData
}

export type CryptoAnswer = {
    Name: String,
    ShortName: String,
    ImageURL: String,
    Rate: string,
    DayChange: string,
    TickerStatus: Boolean
};