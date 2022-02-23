var config = {
    bet: { label: 'Bet', value: 10, type: 'number' },
    payout: { label: 'Payout', value: 1.3, type: 'number' },

}
var lastPayout = 0;
var bet = config.bet.value;
var payout = config.payout.value;

function main() {
    Bet(bet, payout);
}
  
function Bet(bet, payout) {
    game.onBet = function() {
        lastPayout = game.bet(bet, payout).then(function(payout) {
        if (payout > 1) {
            log.success("We won, payout " + payout + "X!");
            return 1;
        } else {
            log.error("We lost, payout " + payout + "X!");
            return 0;
        }
        });
        log.error(payout);
    };
    
}