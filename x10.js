var config = {
    bet: { label: 'Bet', value: (Math.round(currency.amount/260000 * 100000000) / 100000000), type: 'number' },
    multiBetting: { label: "Multi: ", value: 1.35, type: "number" },
    payout: { label: 'Payout', value: 10, type: 'number' },
    loseStreakToChange: { label: "Max lose streak to Change: ", value: 30, type: "number" },
    payoutChange: { label: "Payout change after 1 lose ", value: 4, type: "number" },
    multiChange: { label: "Multi Change: ", value: 1.35, type: "number" },
}

function main() {
    
    var bet = config.bet.value;
    var mainBet = config.bet.value;
    var payout = config.payout.value;
    var mainPayout = payout;
    var multiBetting = config.multiBetting.value;
    var loseStreakToChange = config.loseStreakToChange.value;
    var payoutChange = config.payoutChange.value;    
    var paying = payout;
    var loseStreak = 0;
    var maxLoseStreak = 0
    var winStreak = 0;
    var profit = 0;
    var winPrice = 0;
    var timeStart = "";
    var takeprofit = (Math.round(currency.amount * 0.1 * 100000000) / 100000000)
    timeStart = getTime();
    log.info("Start at: " + timeStart);

    game.onBet = function () {
        payout = paying;
        log.info("Bet: " + (Math.round(bet * 100000000) / 100000000) + ", Payout at: " + payout);
        game.bet(bet, payout).then(function (payout) {
            if (payout > 1) {
                winPrice = Math.round((bet * (payout - 1)) * 100000000) / 100000000;
                profit += winPrice;
                loseStreak = 0;
                winStreak += 1;
                log.success("Win " + winPrice + ", Profit: " + Math.round(profit * 100000000) / 100000000);
                bet = mainBet
                paying = mainPayout;
            }

            else {
                lostP = Math.round(bet * 100000000) / 100000000;
                profit -= lostP;
                winStreak = 0;
                log.error("Lose " + lostP + ", Profit: " + Math.round(profit * 100000000) / 100000000);
                loseStreak += 1;
                if(maxLoseStreak < loseStreak){
                    maxLoseStreak = loseStreak;
                }
                if(loseStreak >= loseStreakToChange){
                    paying = payoutChange
                    bet = Math.round(bet * (mainPayout/payoutChange) * 100000000) / 100000000;
                }
                else{
                    bet = Math.round(bet * multiBetting * 100000000) / 100000000;
                }
                log.info("Lose Streak: Max: " + maxLoseStreak + " - Now: " + loseStreak + " time!");                
                }
        });
    }
    if (profit >= takeprofit) {
        game.stop();
    }
}

function getTime() {
    var d = new Date();
    var time = addZero(d.getHours()) + ":" + addZero(d.getMinutes());
    return time;
}
function addZero(num) {
    if (num < 10) {
        return "0" + num;
    }
    else {
        return "" + num;
    }
}