var config = {
    bet: { label: 'bet', value: 100, type: 'number' },
    payout: { label: 'payout', value: 1.1, type: 'number' }
}




function main() {
    log.info("Start");
    var bet = config.bet.value;
    var payout = config.payout.value;
    var mainB = bet;
    var mainP = payout;
    var loseS = 0;
    var winS = 0;
    var Bbet = 0;
    var profit = 0;
    var sleep = 0;
    var winP = 0;
    game.onBet = function () {
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                winP = Math.round((bet * (config.payout.value - 1)) * 100) / 100;
                profit += winP;
                log.success("We won " + winP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 100) / 100);
                if (sleep <= 0) {
                    if (loseS >= 1) {
                        bet = Bbet;
                    }
                    loseS = 0;
                    winS += 1;
                    if (winS >= 1 && winS <= 8) {
                        bet = bet + winP;
                    }
                    else if (winS > 8) {
                        bet = mainB;
                        winS = 0;
                    }
                    log.info("Win streak: " + winS + " time!");
                }
                else {
                    bet = currency.minAmount;
                }

            } else {
                lostP = Math.round(bet * 100) / 100;
                profit -= lostP;
                log.error("We lost " + lostP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 100) / 100);
                loseS += 1;
                if (loseS >= 1 || sleep > 0) {
                    if (loseS == 1) {
                        Bbet = Math.round(bet * 2 * 100) / 100;
                        sleep = Math.floor(Math.random() * (11)) + 5;
                        log.info("Random sleep: " + sleep + " time!");
                    }
                    bet = currency.minAmount;
                }
                else {
                    bet = bet * 2;
                }
                winS = 0;
            }
        });
        if (sleep > 0) {
            log.info("Sleep: " + sleep + " left!");
        }
        if (sleep == 0 && loseS >= 1) {
            log.info("Sleep until win!");
        }
        if (bet > mainB * 40) {
            bet = mainB * 10;
        }
        sleep -= 1;
        if (profit <= mainB * (-400) || profit >= mainB * 400) {
            game.stop();
        }
    }
}



