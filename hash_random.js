var config = {
    donateTitle: { label: "Donate (TRX - USDT - BTT)", type: "title" },
    donateValue: { label: 'My TRC20 address', value: "TJLKaDdAdgJG1nnHaPYEeTozw2qTUBTYp4", type: 'number' },
    settingTitle: { label: "Setting", type: "title" },
    bet: { label: 'Bet', value: 0.0001, type: 'number' },
    payout1: { label: 'Payout from', value: 1.2, type: 'number' },
    payout2: { label: 'Payout to', value: 1.5, type: 'number' },
    multi: { label: 'After lose multi', value: 1.2, type: 'number' },
    betMax: { label: 'Bet Max', value: 1000000, type: 'number' },
    stopLost: { label: 'Stop Lost', value: 999, type: 'number' },
    takeProfit: { label: 'Take Profit', value: 999, type: 'number' }
}




function main() {
    log.info("Start");
    var bet = config.bet.value;
    var payout1 = config.payout1.value;
    var payout2 = config.payout2.value;
    var payout = 0
    var betMax = config.betMax.value;
    var multi = config.multi.value
    var stopLost = config.stopLost.value;
    var takeProfit = config.takeProfit.value;
    var payoutB = 0
    var mainB = bet;
    var loseS = 0;
    var winS = 0;
    var profit = 0;
    var winP = 0;
    game.onBet = function () {
        payout = ((Math.random() * (payout2-payout1)*10)+payout1*10)/10;
        payout = Math.round(payout * 100) / 100;
        payoutB = payout;
        log.info("Bet: " + bet + " - Payout: " + payout);
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                winP = Math.round((bet * (payoutB - 1)) * 1000000) / 1000000;
                profit += winP;
                log.success("We won " + winP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                loseS = 0;
                winS += 1;
                bet = mainB;
                log.info("Win streak: " + winS + " time!");

            } else {
                lostP = Math.round(bet * 1000000) / 1000000;
                profit -= lostP;
                winS = 0;
                loseS += 1;
                log.error("We lost " + lostP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                log.info("Lose streak: " + loseS + " time!");
                bet = bet * multi;
            }
        });
        if (profit <= stopLost*(-1) || profit >= takeProfit || bet >= betMax) {
            game.stop();
        }
    }
}