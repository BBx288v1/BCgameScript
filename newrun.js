var config = {
    bet: { label: 'Bet', value: 10, type: 'number' },
    payout: { label: 'Payout', value: 1.3, type: 'number' },

    onWinTitle: { label: "On win", type: "title" },
    maxWinStreak: { label: "Max win streak to reset bet: ", value: 3, type: "number" },
    //minWinStreak: { label: "Min win streak to reset bet: ", value: 8, type: "number" },

    onLoseTitle: { label: "On lose", type: "title" },
    maxLoseStreak: { label: "Lose streak to sleep bet: ", value: 1, type: "number" },
    maxLoseStreakToMain: { label: "Max lose streak to return main bet: ", value: 8, type: "number" },
    //loseWinStreak: { label: "Min lose streak to sleep bet: ", value: 8, type: "number" },
    multiBetting: { label: "Multi bet after lose: ", value: 2, type: "number" },
    payoutChange: { label: "Payout change after 1 lose ", value: 2, type: "number" },

    sleepTitle: { label: "Sleep setting", type: "title" },
    sleepMin: { label: "Min time sleep after lose base payout: ", value: 1, type: "number" },
    sleepMax: { label: "Max time sleep after lose base payout: ", value: 2, type: "number" },
    sleepMinEx: { label: "Min time sleep after lose change payout: ", value: 1, type: "number" },
    sleepMaxEx: { label: "Max time sleep after lose change payout: ", value: 4, type: "number" },
    sleepUntilWinOn: { label: "Sleep until win if number of sleep < ", value: 8, type: "number" },
    payoutForSleep: { label: "Payout for sleep: ", value: 2, type: "number" },

    multiBalanceTitle: { label: "Setting Bet With multi Balance", type: "title" },
    multiBalance: {
    label: "",
    value: "true",
    type: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ],
    },
    multiBalanceNum: { label: 'Number of Multi Balance: ', value: 100, type: 'number' },

    stopSettingTitle: { label: "Stop setting", type: "title" },
    takeProfit: { label: 'Take profit: ', value: 1000, type: 'number' },
    stopLoss: { label: 'Stop loss: ', value: 1000, type: 'number' },
    maxBet: { label: 'Stop if bet >', value: 500, type: 'number' },
}

function main() {
    
    var bet = config.bet.value;
    var payout = config.payout.value;
    var takeProfit = config.takeProfit.value;
    var stopLoss = config.stopLoss.value;
    var maxBet = config.maxBet.value;
    var sleepMin = config.sleepMin.value;
    var sleepMax = config.sleepMax.value;
    var sleepMinEx = config.sleepMinEx.value;
    var sleepMaxEx = config.sleepMaxEx.value;
    var maxWinStreak = config.maxWinStreak.value;
    //var minWinStreak = config.minWinStreak.value;
    var maxLoseStreak = config.maxLoseStreak.value;
    var maxLoseStreakToMain = config.maxLoseStreakToMain.value;
    //var minLoseStreak = config.minLoseStreak.value;
    var multiBetting = config.multiBetting.value;
    var payoutChange = config.payoutChange.value;
    var sleepUntilWinOn = config.sleepUntilWinOn.value;
    var payoutForSleep = config.payoutForSleep.value;
    var multiBalance = config.multiBalance.value;
    var multiBalanceNum = config.multiBalanceNum.value;
    var betForSleep = currency.minAmount;
    var nameCoin = currency.currencyName;
    var balance = currency.amount;
    var mainBet = bet;
    var mainPayout = payout;
    var paying = payout;
    var loseStreak = 0;
    var winStreak = 0;
    var betBackUp = bet;
    var profit = 0;
    var sleep = 0;
    var sleepUntilWin = 0;
    var winPrice = 0;
    var sleepBackUp = 0;
    var timeStart = "";
    var timeStop = "";
    var mainLoseStreak = 0;
    timeStart = getTime();
    log.info("Start at: " + timeStart);

    game.onBet = function () {
        if (sleep > 0) {
            sleep -= 1;
            if (sleepUntilWin == 1) {
                log.info("Sleep until win!");
                sleep += 1;
            }
            else if (sleepUntilWin == 0) {
                log.info("Sleep: " + sleep + " left!");
            }

            if (sleep == 0 && sleepUntilWin == 0) {
                bet = betBackUp;
                paying = payoutChange;
            }

        }
        payout = paying;
        if (sleep <= 0) {
            log.info("Bet: " + (Math.round(bet * 1000) / 1000) + ", Payout at: " + payout);
        }
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                if (sleep <= 0) {
                    if (paying == mainPayout) {
                        winPrice = Math.round((bet * (mainPayout - 1)) * 1000) / 1000;
                    }
                    else if (paying == payoutChange) {
                        winPrice = Math.round((bet * (payoutChange - 1)) * 1000) / 1000;
                    }
                }
                else {
                    winPrice = Math.round((betForSleep * (payoutChange - 1)) * 1000) / 1000;
                }
                profit += winPrice;
                loseStreak = 0;

                if (sleep <= 0) {
                    log.success("Win " + winPrice + ", Profit: " + Math.round(profit * 1000) / 1000);
                    if (paying == mainPayout) {
                        winStreak += 1;
                        log.info("Win streak: " + winStreak + " time!");
                    }
                    else {
                        log.info("Back to " + mainPayout + "X!");
                    }
                    
                    if (winStreak >= 1 && winStreak < maxWinStreak && paying == mainPayout) {
                        bet = bet + winPrice;
                    }

                    else if (winStreak >= maxWinStreak && paying == mainPayout) {
                        if(balance < currency.amount && multiBalance == "true"){
                            balance = currency.amount;
                            mainBet = (Math.round(balance * 1000) / 1000)/multiBalanceNum;
                        }
                        bet = mainBet;
                        winStreak = 0;
                    }

                    if (paying == payoutChange) {
                        bet = mainBet;
                        winStreak = 0;
                    }
                    paying = mainPayout;
                    mainLoseStreak = 0;

                }

                else if (sleep == 1) {
                    if (sleepUntilWin == 1) {
                        sleepUntilWin = 0;
                        bet = betBackUp;
                        sleep = 0;
                        paying = payoutChange;
                        log.info("Continue bet!");
                    }
                }

                else {
                    bet = betForSleep;
                }
            }

            else {
                lostP = Math.round(bet * 1000) / 1000;
                profit -= lostP;
                winStreak = 0;

                if (sleep <= 0) {
                    log.error("Lose " + lostP + ", Profit: " + Math.round(profit * 1000) / 1000);
                    if (paying == payoutChange) {
                        loseStreak += 1;
                        mainLoseStreak += 1;
                        log.info("Lose streak: " + mainLoseStreak + " time!");
                    }
                    if (((loseStreak == 0 && paying == mainPayout) || (loseStreak >= maxLoseStreak && paying == payoutChange)) && sleep <= 0) {
                        betBackUp = Math.round(bet * multiBetting * 1000) / 1000;

                        if (loseStreak == 0) {
                            sleep = Math.floor(Math.random() * (sleepMax - sleepMin + 1)) + sleepMin + 1;
                            log.info("Random for 1 time lose!");
                        }

                        if (loseStreak >= maxLoseStreak) {
                            sleep = Math.floor(Math.random() * (sleepMaxEx - sleepMinEx + 1)) + sleepMinEx + 1;
                            log.info("Random for 4 time lose!");
                            loseStreak == 0;
                        }

                        sleepBackUp = sleep;
                        log.info("Random sleep: " + (sleep - 1) + " time!");
                        paying = payoutForSleep;
                    }
                    bet = Math.round(bet * multiBetting * 1000) / 1000;
                }

                if(mainLoseStreak >= maxLoseStreakToMain){
                    mainLoseStreak = 0;
                    bet = mainBet;
                }

                if (sleep > 0) {
                    bet = betForSleep;
                    if (sleep == 1 && sleepBackUp < sleepUntilWinOn) {
                        sleepUntilWin = 1;
                    }
                }

            }
        });

        if (profit <= (-stopLoss) || profit >= takeProfit || bet >= maxBet) {
            timeStop = getTime();
            log.info("Start at: " + timeStart + " And stop at: " + timeStop);
            game.stop();
        }
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