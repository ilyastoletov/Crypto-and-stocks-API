import Fastify from "fastify";
import axios from "axios";
import { CryptoDaily, CryptoAnswer } from "./coingecko";

const app = Fastify({logger: true});

const currencies: Array<string[]> = [
    ['bitcoin', 'BTC', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'],
    ['ethereum', 'ETH', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'],
    ['ripple', 'XRP', 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png'],
    ['solana', 'SOL', 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'],
    ['binancecoin', 'BNB', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'],
    ['tron', 'TRX', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'],
    ['cardano', 'ADA', 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png'],
    ['litecoin', 'LTC', 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png'],
    ['monero', 'XMR', 'https://s2.coinmarketcap.com/static/img/coins/64x64/328.png'],
    ['uniswap', 'UNI', 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png'],
    ['dash', 'DASH', 'https://s2.coinmarketcap.com/static/img/coins/64x64/131.png'],
    ['chainlink', 'LINK', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png'],
    ['ethereum-classic', 'ETC', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png'],
    ['bitcoin-cash', 'BCH', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png'],
    ['eos', 'EOS', 'https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png']
];

app.get("/getCrypto", async (req, res) => {
    res.send(await collectCryptoInfo());
})

async function collectCryptoInfo(): Promise<CryptoAnswer[]> {
    const cryptoArray: CryptoAnswer[] = [];
    for (var coin = 0; coin < currencies.length; coin++) {
        const cryptoResult = await getCryptoInfo(currencies[coin]);
        cryptoArray.push(cryptoResult);
    }
    return cryptoArray;
}

async function getCryptoInfo(currencyDetails: string[]): Promise<CryptoAnswer> {
   /*const [cryptoDaily, cryptoNow] = await Promise.all([
        axios.get<CryptoDaily>(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${currencyName}&market=USD&apikey=V54Q1FHM3OAO0BNP`),
        axios.get<CryptoExchangeRate>(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${currencyName}&to_currency=USD&apikey=V54Q1FHM3OAO0BNP`)
    ]);*/

    const currencyName = currencyDetails[0];
    const currencyShortName = currencyDetails[1];
    const currencyImageURL = currencyDetails[2];
    
    const crypto = await axios.get<CryptoDaily>(`https://api.coingecko.com/api/v3/coins/${currencyName}/market_chart?vs_currency=usd&days=1&interval=daily`)

    var fixedRate = 3;
    if (currencyName === 'ripple' || currencyName === 'cordano' || currencyName === 'tron') {
        fixedRate = 6;
    }

    const yesterdayCourse = Number(crypto.data.prices[0][1].toFixed(fixedRate));
    const courseNow = Number(crypto.data.prices[1][1].toFixed(fixedRate));
    var dayChange = (yesterdayCourse - courseNow).toFixed(fixedRate);

    if (Number(dayChange) > 0) {
        dayChange = "-" + dayChange.toString();
    } else {
        dayChange = "+" + dayChange.toString().replace("-", "");
    }

    var tickerStatus: Boolean;
    if (courseNow > yesterdayCourse) {
        tickerStatus = true
    } else {
        tickerStatus = false
    }

    const answer: CryptoAnswer = {
        Name: currencyName.charAt(0).toUpperCase() + currencyName.slice(1),
        ShortName: currencyShortName,
        ImageURL: currencyImageURL,
        Rate: courseNow.toString(),
        DayChange: dayChange,
        TickerStatus: tickerStatus
    }
    return answer;
}

function getYesterdayDate(): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const year = yesterday.getFullYear();
    const month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
    const day = yesterday.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }


app.listen(5000, "0.0.0.0");