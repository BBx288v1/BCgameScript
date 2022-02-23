var config = {
    donateTitle: { label: "Donate (TRX - USDT - BTT)", type: "title" },
    donateValue: { label: 'My TRC20 address', value: "TJLKaDdAdgJG1nnHaPYEeTozw2qTUBTYp4", type: 'number' },

    settingTitle: { label: "Standby setting", type: "title" },
    bet: { label: 'Bet', value: 0.0001, type: 'number' },
    payout: { label: 'Payout', value: 10, type: 'number' },

    settingDiceTitle1: { label: "Setting after lose streak 1", type: "title" },
    loseStreak1: { label: 'After lose streak', value: 10, type: 'number' },
    bet1: { label: 'Change bet to', value: 1, type: 'number' },
    payout1: { label: 'Change payout to', value: 10, type: 'number' },
    timeDice1: { label: 'Time dice', value: 4, type: 'number' },

    settingDiceTitle2: { label: "Setting after lose streak 2", type: "title" },
    loseStreak2: { label: 'After lose streak', value: 20, type: 'number' },
    bet2: { label: 'Change bet to', value: 0.001, type: 'number' },
    payout2: { label: 'Change payout to', value: 10, type: 'number' },
    timeDice2: { label: 'Time dice', value: 4, type: 'number' },

    settingDiceTitle3: { label: "Setting after lose streak 3", type: "title" },
    loseStreak3: { label: 'After lose streak', value: 30, type: 'number' },
    bet3: { label: 'Change bet to', value: 0.0001, type: 'number' },
    payout3: { label: 'Change payout to', value: 1.2, type: 'number' },
    timeDice3: { label: 'Time dice', value: 99, type: 'number' },

    stopSettingTitle: { label: "Stop setting", type: "title" },
    betMax: { label: 'Bet Max', value: 1000000, type: 'number' },
    stopLost: { label: 'Stop Lost', value: 999, type: 'number' },
    takeProfit: { label: 'Take Profit', value: 999, type: 'number' }
}




function main() {
    log.info("Start");
    var listStreak=[config.loseStreak1.value, config.loseStreak2.value, config.loseStreak3.value];
    var listBet=[config.bet1.value,config.bet2.value,config.bet3.value,config.bet.value];
    var listMainBet = [config.bet1.value,config.bet2.value,config.bet3.value,config.bet.value];
    var listPayout=[config.payout1.value,config.payout2.value,config.payout3.value,config.payout.value];
    var listTimeDice=[config.timeDice1.value,config.timeDice2.value,config.timeDice3.value,99];
    var mainPayout = 0
    var betMax = config.betMax.value;
    var stopLost = config.stopLost.value;
    var takeProfit = config.takeProfit.value;
    var mainB = 0;
    var noBet = 0
    var loseS = 0;
    var winS = 0;
    var profit = 0;
    var winP = 0;
    var randomNum = 0
    var timeDice = 99;
    var check = true;
    game.onBet = function () {
        check = true;
        for (var i = 0; i < 3; i++){
            if(loseS >= listStreak[i] && loseS < listStreak[i]+listTimeDice[i]){
                noBet = i
                check = false;
                break;
            }
        }
        if(check){
            noBet = 3
             
        }
        bet = listBet[noBet];
        payout = listPayout[noBet];
        mainB = listMainBet[noBet];
        mainPayout = listPayout[noBet];
        log.info("Bet: " + bet + " - Payout: " + payout);
        game.bet(bet, payout).then(function (payout) {

            if (payout > 1) {
                winP = Math.round((bet * (config.payout.value - 1)) * 1000000) / 1000000;
                profit += winP;
                log.success("We won " + winP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                loseS = 0;
                winS += 1;
                bet = mainB;
                listBet[noBet] = bet;
                log.info("Win streak: " + winS + " time!");

            } else {
                lostP = Math.round(bet * 1000000) / 1000000;
                profit -= lostP;
                winS = 0;
                loseS += 1;
                log.error("We lost " + lostP + ", payout " + payout + "X! " + "Profit: " + Math.round(profit * 1000000) / 1000000);
                log.info("Lose streak: " + loseS + " time!");
                if(mainPayout > 2){
                    bet = bet * (Math.round((1 + 1/(mainPayout-1))*10000)/10000);
                }
                //else{
                    //bet = bet * (1/(mainPayout-1)+1);
                //}
                listBet[noBet] = bet;
            }
        });
        if (profit <= stopLost*(-1) || profit >= takeProfit || bet >= betMax) {
            game.stop();
        }
    }
}