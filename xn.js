var config = {
    bet: { label: 'bet', value: currency.minAmount, type: 'number' },
    payout: { label: 'payout', value: 0.1, type: 'number' }
}


function main() {
    log.info("Start");
    var bet = config.bet.value;
    var payout = config.payout.value;
    var outP = config.payout.value;
    var mainB = bet;
    var mainP = payout;
    var loseS = 0;
    var Bbet = 0;
    var profit = 0;
    var sleep = 0;
    game.onBet = function () {
        game.bet(bet, payout).then(function (payout) {
            if (payout > 1) {
                profit += bet*payout;
                log.success("We won " + bet + ", payout " + payout + "X! " + "Profit: " + profit);
                if (sleep <= 0) {
                    if (loseS >= 4) {
                        bet = Bbet;
                    }
                    else {
                        bet = mainB;
                    }
                    loseS = 0;
                }
                else {
                    bet = currency.minAmount;
                }

            } else {
                profit -= bet;
                log.error("We lost " + bet + ", payout " + payout + "X! " + "Profit: " + profit);
                loseS += 1;
                if (loseS >= 4 || sleep > 0) {
                    if (loseS == 4) {
                        Bbet = Math.round(bet * 0.3 * 100) / 100 + bet;
                        sleep = Math.floor(Math.random() * (4 - 1 + 1))+1 ;
                        log.info("Random sleep: " + sleep + " time!");
                    }
                    bet = currency.minAmount;
                    outP =2;
                }
                else {
                    bet = Bbet = Math.round(bet * 0.3 * 100) / 100 + bet;
                }
            }
        });
        if(sleep > 0){
            log.info("Sleep: " + sleep + " left!");
        }
        sleep -= 1;        
        if (profit <= mainB*(-400) || profit >= mainB*400) {
            game.stop();
        }
    }
}