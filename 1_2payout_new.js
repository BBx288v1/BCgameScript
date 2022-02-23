var config = {
    donateTitle: { label: "Donate (TRX - USDT - BTT)", type: "title" },
    donateValue: { label: 'My TRC20 address', value: "TJLKaDdAdgJG1nnHaPYEeTozw2qTUBTYp4", type: 'number' },
    settingTitle: { label: "Setting", type: "title" },
    takeProfit: { label: 'Take Profit', value: 100, type: 'number' }
}

function main() {
    log.info("Start");
    balance = currency.amount;
    baseBet = balance/20000;
    takeProfit  = config.takeProfit.value
    bet = baseBet
    payoutMin = 1.26
    payoutB = payoutMin
    taget = 5
    highPayout = 2
    multiplyHight = 2
    superHighPayout = 4
    multiplySuper = 1.5
    maxloseS = 5
    res = balance/10
    currentProfit  = 0
    profit  = 0
    winS = 0
    loseS = 0
    game.onBet = function () {
        payout = payoutB
        log.info("Bet: " + bet + " - Payout: " + payout);
        game.bet(bet, payout).then(function (payout) {
            if (payout > 1) {
                winP = (bet * (payoutB - 1));
                profit += winP;
                currentProfit += winP;
                log.success("We won: " + winP + "Profit: " + Math.round(profit * 1000000) / 1000000);
                loseS = 0;
                winS += 1
                if(bet * payoutMin < baseBet*taget){
                    bet = bet*payoutMin;
                }      
                else{
                    bet = baseBet;
                }
                payoutB = payoutMin                    
                log.info("Win streak: " + winS + " time!");

            } 
            else {
                lostP = bet;
                profit -= lostP;
                currentProfit -= lostP;
                loseS += 1;
                log.error("We lost: " + lostP + "Profit: " + Math.round(profit * 1000000) / 1000000);
                if(loseS == 1){
                    payoutB = highPayout;
                    bet = bet*highPayout;
                }
                if(loseS % maxloseS == 0){
                    if(payoutB == highPayout){
                        bet = bet*highPayout/(payoutMin-1);
                    }
                    else if(payoutB ==superHighPayout){
                        bet = bet*superHighPayout/(payoutMin-1);
                    }
                    payoutB = payoutMin
                }
                else if((loseS % (maxloseS+1) == 0) || (loseS>10 && (loseS-1)%5==0)){
                    payoutB = superHighPayout;
                    bet = bet*multiplyHight;
                }
                else{
                    if(payoutB == highPayout){
                        bet = bet*multiplyHight;
                    }
                    else if(payoutB == superHighPayout){
                        bet = bet*multiplySuper;
                    }
                }
            }
            
        });
        if(currentProfit >= res){
            currentProfit = 0;
            baseBet = balance/20000;
        }
        if (profit >= takeProfit) {
            game.stop();
        }
    }
}                        