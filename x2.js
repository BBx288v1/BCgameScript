var config = {
    betSettingTitle: { label: "Bet Settings", type: "title" },
    bet: { label: "Bet", value: 0.12, type: "number" },
    payout: { label: "Payout", value: 2, type: "number" },

    onLoseTitle: { label: "On lose", type: "title" },
    onLose: { label: "Multiply the bet", value: 2, type: "number" },

    sleepSettingTitle: { label: "Sleep Settings", type: "title" },
    sleepAfter: { label: "Sleep after losing", value: 1, type: "number" },
    sleepUntilWin: {
        label: "Sleep until win",
        value: "true",
        type: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ],
    },
    stopSleepWin: {
        label: "Stop sleep if win",
        value: "false",
        type: "radio",
        options: [
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
        ],
    },
    sleepMin: { label: "Sleep from", value: 1, type: "number" },
    sleepMax: { label: "to", value: 5, type: "number" },

    stopSettingTitle: { label: "Stop Settings", type: "title" },
    stopSettingTitle: { label: "Stop setting", type: "title" },
    takeProfit: { label: "Take profit", value: 1000, type: "number" },
    stopLoss: { label: "Stop loss", value: 1000, type: "number" },
    maxBet: { label: "Stop if bet >", value: 500, type: "number" },
};

function main() {
    log.info("Start");
    var bet = config.bet.value;
    var betSleep = currency.minAmount;
    var payout = config.payout.value;
    var sleepAfter = config.sleepAfter.value;
    var sleepMin = config.sleepMin.value;
    var sleepMax = config.sleepMax.value;
    var onLose = config.onLose.value;
    var takeProfit = config.takeProfit.value;
    var stopLoss = config.stopLoss.value;
    var maxBet = config.maxBet.value;
    var stopSleepWin = config.stopSleepWin.value;
    var sleepUntilWin = config.sleepUntilWin.value;
    var mainB = bet;
    var checkSleepUntilWin = 0;
    var loseS = 0;
    var Bbet = mainB;
    var profit = 0;
    var sleep = 0;
    game.onBet = function () {
        if (sleep <= 0) {
            bet = Bbet;
            log.info("Bet " + bet * (payout - 1));
            checkSleepUntilWin = 0;
        } else {
            bet = betSleep;
            sleep -= 1;
            if (checkSleepUntilWin == 0) log.info("Sleep: " + sleep + " left!");
        }
        game.bet(bet, payout).then(function (payout) {
            if (payout > 1) {
                profit += bet * (payout - 1);
                if (sleep <= 0 && bet != betSleep) {
                    log.success(
                        "Won - Profit: " + Math.round(profit * 100000000) / 100000000
                    );
                    Bbet = mainB;
                    loseS = 0;
                } else {
                    bet = betSleep;
                    if (stopSleepWin == "true") {
                        sleep = 0;
                    }
                }
            } else {
                profit -= bet;
                if (bet != betSleep)
                    log.error(
                        "Lost - Profit: " + Math.round(profit * 100000000) / 100000000
                    );
                loseS += 1;
                if (loseS >= sleepAfter && bet != betSleep) {
                    Bbet = Bbet * onLose;
                    sleep =
                        Math.floor(Math.random() * (sleepMax - sleepMin + 1)) + sleepMin;
                    log.info("Random sleep: " + sleep + " time!");
                }
                if (sleepUntilWin == "true") {
                    if (sleep == 0) {
                        sleep += 1;
                        checkSleepUntilWin = 1;
                        log.info("Sleep until win!");
                    }
                }
            }
        });

        if (profit <= -stopLoss || profit >= takeProfit || bet >= maxBet) {
            game.stop();
        }
    };
}
