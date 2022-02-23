var config = {
    bet: { label: 'bet', value: 10, type: 'number' },
    payout: { label: 'payout', value: 1.1, type: 'number' }
}

function main() {
    log.info("Start");
    var bet = config.bet.value;
    var payout = config.payout.value;
    var mainB = bet;
    var mainP = payout;
    var paying = payout;
    var loseS = 0;
    var winS = 0;
    var Bbet = bet;
    var profit = 0;
    var sleep = 0;
    var sleepU = 0;
    var winP = 0;

    var eqBet = 2;
    var payC = 2;
    var maxNbet = 400;
    var stopNbet = 400;
    var tpNbet = 400;
    game.onBet = function () {
        payout = paying;

        if (sleep > 0) {
            
            sleep -= 1;
            if(sleepU == 1){
                log.info("Sleep until win!");
                sleep+=1;
            }
            else if(sleepU == 0){
                log.info("Sleep: " + sleep + " left!");
            }            

            if (sleep == 0 && sleepU == 0) {
                bet = Bbet;
            }
            
        }

        //log.info(Bbet);
        //log.info(bet);
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                if (paying == mainP) {
                    winP = Math.round((bet * (mainP - 1)) * 100) / 100;
                }
                else if (paying == payC) {
                    winP = Math.round((bet * (payC - 1)) * 100) / 100;
                }
                profit += winP;
                log.success("We won " + winP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 100) / 100);
                loseS = 0;

                if (sleep <= 0) {
                    if(paying == mainP){
                        winS += 1;
                        log.info("Win streak: " + winS + " time!");
                    }
                    else{
                        log.info("Back to "+ mainP +"X!");
                    }                  
                    if (winS >= 1 && winS <= 8 && paying == mainP) {
                        bet = bet + winP;
                    }

                    else if (winS > 8 && paying == mainP) {
                        bet = mainB;
                        winS = 0;
                    }

                    if (paying == payC) {
                        bet = mainB;
                        winS = 0;
                    }
                    paying = mainP;
                    
                }
                
                else if(sleep == 1){
                    if(sleepU == 1){
                        sleepU = 0;
                        bet = Bbet;
                        sleep = 0;
                        log.info("Continue bet!");
                    }    
                }

                else {
                    bet = currency.minAmount;
                } 
            }

            else {
                lostP = Math.round(bet * 100) / 100;
                profit -= lostP;
                log.error("We lost " + lostP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 100) / 100);
                winS = 0;

                if (sleep <= 0) {
                    if(paying == payC){
                        loseS += 1;
                        log.info("Lose streak: " + loseS + " time!");
                    }                    
                    if ((loseS == 0 && paying == mainP) || (loseS >= 4 && paying == payC) && sleep <= 0) {
                        Bbet = Math.round(bet * eqBet * 100) / 100;

                        if (loseS == 0) {
                            sleep = Math.floor(Math.random() * (4)) + 3;
                        }

                        else if (loseS >= 4) {
                            sleep = Math.floor(Math.random() * (11)) + 5;
                        }

                        log.info("Random sleep: " + (sleep - 1) + " time!");
                        paying = payC;
                    }
                    bet = bet * eqBet;
                }

                if (sleep > 0) {
                    bet = currency.minAmount;
                    if(sleep == 1){
                        sleepU = 1;
                    }
                }

            }
        });
        if (bet > mainB * maxNbet) {
            bet = mainB * maxNbet;
        }

        if (profit <= mainB * (-stopNbet) || profit >= mainB * tpNbet) {
            game.stop();
        }
    }
}