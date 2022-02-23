var config = {
    baseBet: { label: "Base bet", value: currency.minAmount, type: "number" },
    payout: { label: "Payout", value: 2, type: "number" },
    stop: { label: "Stop if next bet >", value: 1e8, type: "number" },
    onLoseTitle: { label: "On Lose", type: "title" },
    onLoss: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "reset", label: "Return to base bet" },
            { value: "increase", label: "Increase bet by (loss multiplier)" },
        ],
    },
    lossMultiplier: { label: "Loss multiplier", value: 2, type: "number" },
    onWinTitle: { label: "On Win", type: "title" },
    onWin: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "reset", label: "Return to base bet" },
            { value: "increase", label: "Increase bet by (win multiplier)" },
        ],
    },
    winMultiplier: { label: "Win multiplier", value: 2, type: "number" },
    onNotiTitle: { label: "Notification Bet", type: "title" },
    onNoti: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
        ],
    },
    onMaxLoseStreakTitle: { label: "Notification Max Lose Streak", type: "title" },
    onMaxLoseStreak: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
        ],
    },
};
function main() {
    var currentBet = config.baseBet.value;
    var loseStreakMax = 0;
    var loseStreak = 0;
    var numberOfBet = 0;
    var winTime = 0;
    var loseTime = 0;
    timeStart = getTime();
    log.info("Start at: " + timeStart);
    game.onBet = function () {
        game.bet(currentBet, config.payout.value).then(function (payout) {
            numberOfBet+=1;
            if (payout > 1) {
                winTime+=1;
                loseStreak = 0; 
                if (config.onWin.value === "reset") {
                    currentBet = config.baseBet.value;
                } else {
                    currentBet *= config.winMultiplier.value;
                }
                if (config.onNoti.value === "Yes"){
                    log.success(
                        "We won, so next bet will be " +
                        currentBet +
                        " " +
                        currency.currencyName
                    );
                }    
            } else {
                loseTime+=1;
                loseStreak += 1;
                if (config.onLoss.value === "reset") {
                    currentBet = config.baseBet.value;
                } else {
                    currentBet *= config.lossMultiplier.value;
                }
                if (config.onNoti.value === "Yes"){
                    log.error(
                        "We lost, so next bet will be " +
                        currentBet +
                        " " +
                        currency.currencyName
                    );
                }
                if(loseStreak > loseStreakMax){
                    loseStreakMax = loseStreak;
                    if (config.onMaxLoseStreak.value === "Yes"){
                        log.success(
                            "Biggest number of Lose streak: " +
                            loseStreakMax
                        );
                        log.info(
                            "Start at: " + 
                            timeStart + 
                            " and found that at: " + 
                            getTime()
                        );
                        log.info(
                            "With: " + 
                            winTime +
                            " win - " + 
                            loseTime +   
                            " lose - And total bet: " + 
                            numberOfBet
                        );
                        log.info(
                            "---------------------"
                        );
                    }
                }   
                
            }
            if (currentBet > config.stop.value) {
                log.error(
                    "Was about to bet " + currentBet + " which triggers the stop"
                );
                timeStop = getTime();
                log.info("Start at: " + timeStart + " And stop at: " + timeStop);
                game.stop();    
            }
        });
    };
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