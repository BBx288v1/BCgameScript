var config = {
    donateTitle: { label: "Donate (TRX - USDT - BTT)", type: "title" },
    donateValue: { label: 'My TRC20 address', value: "TJLKaDdAdgJG1nnHaPYEeTozw2qTUBTYp4", type: 'number' },
    settingTitle: { label: "Setting", type: "title" },
    bet: { label: 'Bet', value: 0.0001, type: 'number' },
    numBet: { label: 'Number of Bet array', value: 10, type: 'number' },
    payout: { label: 'Payout', value: 1.2, type: 'number' },
    betMax: { label: 'Bet Max', value: 1000000, type: 'number' },
    stopLost: { label: 'Stop Lost', value: 999, type: 'number' },
    takeProfit: { label: 'Take Profit', value: 999, type: 'number' }
}




function main() {
    log.info("Start");
    var bet = config.bet.value;
    var numBet = config.numBet.value;
    var listBet=[]
    for(var i=0; i<numBet; i++){
        listBet.push(bet)
    }
    var mainPayout = config.payout.value;
    var payout = config.payout.value;
    var betMax = config.betMax.value;
    var stopLost = config.stopLost.value;
    var takeProfit = config.takeProfit.value;
    var mainB = bet;
    var loseS = 0;
    var winS = 0;
    var Bbet = 0;
    var profit = 0;
    var winP = 0;
    var randomNum = 0
    game.onBet = function () {
        randomNum = Math.floor(Math.random() * numBet);
        bet = listBet[randomNum];
        log.info("Bet: " + bet + " - Payout: " + payout);
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                winP = Math.round((bet * (config.payout.value - 1)) * 1000000) / 1000000;
                profit += winP;
                log.success("We won " + winP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                loseS = 0;
                winS += 1;
                if (bet + winP < mainB * 2) {
                    bet = bet + winP;
                }
                else{
                    bet = mainB;
                    winS = 0;
                }
                listBet[randomNum] = bet;
                log.info("Win streak: " + winS + " time!");

            } else {
                lostP = Math.round(bet * 1000000) / 1000000;
                profit -= lostP;
                winS = 0;
                loseS += 1;
                log.error("We lost " + lostP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                log.info("Lose streak: " + loseS + " time!");
                if(payout > 2){
                    bet = bet * (1 + 1/(mainPayout-1));
                }
                else{
                    bet = bet * (1/(mainPayout-1)+1);
                }
                listBet[randomNum] = bet;
            }
        });
        if (profit <= stopLost*(-1) || profit >= takeProfit || bet >= betMax) {
            game.stop();
        }
    }
}