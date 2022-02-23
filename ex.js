var config = {
    bet: { label: "bet", value: currency.minAmount, type: "number" },
    basePayout: { label: "base payout", value: 2, type: "number" },
    stop: { value: 20, type: "number", label: "stop if next payout >" },
    onLoseTitle: { label: "On Lose", type: "title" },
    onLoss: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "reset", label: "Return to base bet" },
            { value: "increase", label: "Increase payout by (loss payout)" },
        ],
    },
    lossAdd: { label: "loss payout +", value: 1, type: "number" },
    onWinTitle: { label: "On Win", type: "title" },
    onWin: {
        label: "",
        value: "reset",
        type: "radio",
        options: [
            { value: "reset", label: "Return to base bet" },
            { value: "increase", label: "Increase payout by (win payout)" },
        ],
    },
    winAdd: { label: "win payout +", value: 1, type: "number" },
};

function main() {
    var currentPayout = config.basePayout.value;
    game.onBet = function () {
        game.bet(config.bet.value, currentPayout).then(function (payout) {
            if (payout > 1) {
                if (config.onWin.value === "reset") {
                    currentPayout = config.basePayout.value;
                } else {
                    currentPayout += config.winAdd.value;
                }
                log.success("We won, so next payout will be " + currentPayout + " x");
            } else {
                if (config.onLoss.value === "reset") {
                    currentPayout = config.basePayout.value;
                } else {
                    currentPayout += config.lossAdd.value;
                }
                log.error("We lost, so next payout will be " + currentPayout + " x");
            }
            if (currentPayout > config.stop.value) {
                log.error(
                    "Was about to bet with payout " +
                    currentPayout +
                    " which triggers the stop"
                );
                game.stop();
            }
        });
    };
}