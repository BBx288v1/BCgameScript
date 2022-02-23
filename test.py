import random
import time
import math
lastPayout=0
payouting = 2
bet = 10
bet1 = 10
bet2 = 10
bet3 = 10
bet4 = 10
maxBet = 10
profit = 0.00                             
while True:
    check = True
    if(lastPayout > 2 and lastPayout <=3):
        payouting = lastPayout - math.floor(lastPayout)+1
        bet = bet1
    elif(lastPayout > 3 and lastPayout <= 5):
        payouting = lastPayout - math.floor(lastPayout)+2
        bet = bet2
    elif(lastPayout > 5 and lastPayout <= 10):
        payouting = lastPayout - math.floor(lastPayout)+3
        bet = bet3
    elif(lastPayout > 10  and lastPayout <= 50):
        payouting = lastPayout - math.floor(lastPayout)+4
        bet = bet4
    else:
        print("Pass")
        check= False
    
    payout = random.choice(range(10,1000))/10
    if(check):
        print(bet)
        print("Bet: %d Payout at: %.2f" %(bet , payouting))
        if(lastPayout >= payout):
            profit += bet*payouting
            bet = 10
            print("Win %.2f payout %.2f" %(bet*payouting, payout))
        elif(lastPayout <  payout):
            profit -= bet
            print("Lose %.2f payout %.2f" %(bet, payout))
            bet = bet*2
            if(bet >= maxBet):
                maxBet = bet
                print("New max bet: %d" %maxBet)
        if(payouting > 1 and payouting < 2):                                 
            bet1 = bet
        elif(payouting >= 2 and payouting < 3):
            bet2 = bet                                  
        elif(payouting >= 3 and payouting < 4):                               
            bet3 = bet
        elif(payouting >= 4 and payouting < 5):                               
            bet4 = bet
    lastPayout = payout
    print("Profit: %.2f" %profit)
    print("__________________")
    print(bet1)
    print(bet2)
    print(bet3)
    print(bet4)
    print("__________________")
    time.sleep(1)
    
while True:    
    payouting = driver.find_element_by_xpath("/html/body/div[1]/div/div[1]/div[2]/div/div[1]/div[1]/div[2]/div/div[6]/div[2]").get_attribute('textContent')
    if(payout != payouting):
        payout = payouting
        
        print (payout)
    else:
        time.sleep(0.3)
