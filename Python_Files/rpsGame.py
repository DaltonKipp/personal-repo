import random, sys
import time
import platform
import os
import colorama
from colorama import Fore, Style
from colorama.ansi import clear_line, clear_screen
import terminal_formatting as tf

blue = Fore.BLUE + Style.BRIGHT        # Blue
cyan = Fore.CYAN + Style.BRIGHT        # Cyan
red = Fore.RED + Style.BRIGHT          # Red
yellow = Fore.YELLOW + Style.BRIGHT    # Yellow
green = Fore.GREEN + Style.BRIGHT      # Green
white = Fore.WHITE + Style.BRIGHT      # White
reset = Style.RESET_ALL                # Resets all colors

tf.cl(), tf.dl('','/','/'), tf.dl('  ROCK / PARPER / SCISSORS  ','','')
# Terminal size
full = round(tf.col)
mid = round(full/2)
# Initial values
wins = 0
losses = 0
ties = 0
round_count = 0

while True: # Start Menu while loop
    tf.dl('START GAME: [1]','','')
    tf.dl('AUTO MODE : [2]','','')
    tf.dl('QUIT GAME : [3]','','')
    startMove = input('\n\n'+' '*mid)
    if startMove == '1': # Breaks the loop for an accepted answer
        break
    if startMove == '2':
        break
    if startMove == '3':
        break
    elif startMove != '1' or '2' or '3': # Restarts the loop for an unaccepted answer
        print('\n')
        error = red + 'ERROR: PLEASE CHOOSE (1), (2), or (3)' + reset
        print('{0:^{col}s}'.format(error,col=full),end='\n\n')

while startMove == '1': # Start Game Option.
    round_count = round_count + 1
    string = " ROUND {} ".format(round_count)
    tf.dl(string,'/','/')
    print(white)
    print("{0:>{col}s} {1:<{col}}//{2:>{col}} {3:<{col}}//{4:>{col}s} {5:<{col}}".format("WINS:",wins,"LOSSES:",losses,"TIES:",ties,col=round(full/6)))

    while True: # The player input loop.

        tf.dl(' Enter your move: (R)ock (P)aper (S)cissors or (Q)uit ','','')
        playerMove = input('\n\n'+' '*mid)
        print('\n')

        if playerMove == 'q' or playerMove == 'Q':

            if wins == 0 and ties == 0 and losses == 0:
                print('{0:^{col}s}'.format("GOODBYE!",col=full,end="\n\n"))
                tf.dl('','/','/')                        
                print('\n')
                sys.exit()
            tf.dl('','/','/')
            print('\n')
            print(tf.y('{0:^{col}s}').format("F I N A L  S C O R E",col=full))
            print('\n')
            print('{0:>{col}s}{1:<{col}}'.format("WINS:  ",wins,col=mid),end="\n")
            print('{0:>{col}s}{1:<{col}}'.format("TIES:  ",ties,col=mid),end="\n")
            print('{0:>{col}s}{1:<{col}}'.format("LOSSES:  ",losses,col=mid),end="\n")
            games = wins + losses + ties
            print('{0:>{col}s}{1:<2.0f}'.format("GAMES:  ",games,col=mid),end="\n")
            if wins == 0 and losses == 0:
                tf.dl('','/','/')
                print('{0:=^{col}s}'.format((" ENDING GAME "),col=full,end="\n"))
            
            if wins != 0 or losses != 0: 
                winloss = wins/(wins+losses) * 100
                print('{0:>{col}s}{1:<3.0f}{2:<1s}'.format("W/L RATIO:  ",winloss,"%",col=mid),end="\n\n")
            tf.dl('','/','/')                        
            print('\n')    
            sys.exit() # Quit the program.
        
        if playerMove == 'r' or playerMove == 'R' or playerMove == 'P' or playerMove == 'p' or playerMove == 'S' or playerMove == 's':
            break # Break out of the player input loop.
        valid = red + '"' + playerMove + '"' + ' is not a valid input' + reset
        print('{0:^60s}'.format(valid),end="\n")

    # Display what the computer chose:
    randomNumber = random.randint(1, 3)
    if randomNumber == 1:
        computerMove = 'r'
    elif randomNumber == 2:
        computerMove = 'p'
    elif randomNumber == 3:
        computerMove = 's'

    print('{0:>{col}}{1:^{col}}{2:<{col}}\n'.format(playerMove,'VS...',computerMove,col=round(full/3)))
    
    win  = green + '{0:^{col}s}'.format('YOU WON!',col=full-8) + reset # Win String
    tie  = yellow + '{0:^{col}s}'.format('YOU TIED!',col=full-8) + reset # Tie String
    loss = red + '{0:^{col}s}'.format('YOU LOST!',col=full-8) + reset # Loss String

    # Display and record the win/loss/tie:
    if (playerMove == 'R' or playerMove == 'r') and computerMove == 'r': # Rock Tie
        print('     {0:^60s}'.format(tie))
        ties = ties + 1
    if (playerMove == 'S' or playerMove == 's') and computerMove == 's': # Scissors Tie
        print('     {0:^60s}'.format(tie))
        ties = ties + 1
    if (playerMove == 'P' or playerMove == 'p') and computerMove == 'p': # Paper Tie
        print('    {0:^60s}'.format(tie))
        ties = ties + 1
    elif (playerMove == 'r' or playerMove == 'R') and computerMove == 's': # Rock beats Scissors
        print('      {0:^60s}'.format(win))
        wins = wins + 1
    elif (playerMove == 'p' or playerMove == 'P') and computerMove == 'r': # Paper Beats Rock
        print('     {0:^60s}'.format(win))
        wins = wins + 1
    elif (playerMove == 's' or playerMove == 'S') and computerMove == 'p': # Scissors Beats Paper
        print('     {0:^60s}'.format(win))
        wins = wins + 1
    elif (playerMove == 'r' or playerMove == 'R') and computerMove == 'p': # Rock Loses to Paper
        print('     {0:^60s}'.format(loss))
        losses = losses + 1
    elif (playerMove == 'p' or playerMove == 'P') and computerMove == 's': # Paper Loses to Scissors
        print('     {0:^60s}'.format(loss))
        losses = losses + 1
    elif (playerMove == 's' or playerMove == 'S') and computerMove == 'r': # Scissors Loses to Rock
        print('     {0:^60s}'.format(loss))
        losses = losses + 1

while startMove == '2': # Auto Mode Option.
    tf.nl()
    print('{0:^60s}'.format("{0:^{col}s}".format("How many games do you want to simulate?",col=full)),end="\n\n") # Start message
    games = input('\n\n'+' '*mid)
    games = int(games)
    tf.cl()
    print('\n')
    tf.dl('  START  ','/','/'), tf.nl()
    print(tf.y('{0:<{col}s}  {1:<{col}s} {2:<{col}s} {3:<{col}s} {4:<{col}s} {5:<{col}}\n'.format("GAME","USER MOVE","VS.","COMPUTER MOVE","","TALLY",col=full/6)))

    for i in range(0,games,1):
        randomUser = random.randint(1, 3)
        if randomUser == 1:
            userMove = 'ROCK'
        elif randomUser == 2:
            userMove = 'PAPER'
        elif randomUser == 3:
            userMove = 'SCISSORS'

        randomCPU = random.randint(1, 3)
        if randomCPU == 1:
            computerMove = 'ROCK'
        elif randomCPU == 2:
            computerMove = 'PAPER'
        elif randomCPU == 3:
            computerMove = 'SCISSORS'

        win  = green + "WIN" + reset   # Win String
        tie  = yellow + "TIE" + reset # Tie String
        loss = red + "LOSS" + reset    # Loss String

                # Display and record the win/loss/tie:
        if (userMove == 'ROCK') and computerMove == 'ROCK': # Rock Tie
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = tie
            ties = ties + 1
        if (userMove == 'PAPER') and computerMove == 'PAPER': # Paper Tie
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = tie
            ties = ties + 1
        if (userMove == 'SCISSORS') and computerMove == 'SCISSORS': # Scissors Tie
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = tie
            ties = ties + 1

        elif (userMove == 'ROCK') and computerMove == 'SCISSORS': # Rock beats Scissors
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = win
            wins = wins + 1
        elif (userMove == 'PAPER') and computerMove == 'ROCK': # Paper Beats Rock
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = win
            wins = wins + 1
        elif (userMove == 'SCISSORS') and computerMove == 'PAPER': # Scissors Beats Paper
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = win
            wins = wins + 1

        elif (userMove == 'ROCK') and computerMove == 'PAPER': # Rock Loses to Paper
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = loss
            losses = losses + 1
        elif (userMove == 'PAPER') and computerMove == 'SCISSORS': # Paper Loses to Scissors
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = loss
            losses = losses + 1
        elif (userMove == 'SCISSORS') and computerMove == 'ROCK': # Scissors Loses to Rock
            #print('{0:-^60s}'.format(""),end='\n\n')
            tally = loss
            losses = losses + 1

        if tally == tie:
            t = str(ties)
        if tally == win:
            t = str(wins)
        if tally == loss:
            t = str(losses)

        g = str(i+1) # GAME COUNTER   
        print('#{0:<{col}s} {1:<{col}s} {2:<{col}s} {3:<{col}s} {4:<{col}s} {5:<{col}}'.format(g,userMove,"VS.",computerMove,"",tally,col=full/6))
        i = i+1
    
    tf.dl('  END  ','/','/'), tf.nl()
    
    final_score = '{0:^{col}s}\n'.format("F I N A L  S C O R E",col=full)
    print(tf.y(final_score))
    print('{0:>{col}s} {1:<{col}}'.format("WINS: ",wins,col=mid),end="\n")
    print('{0:>{col}s} {1:<{col}}'.format("TIES: ",ties,col=mid),end="\n")
    print('{0:>{col}s} {1:<{col}}'.format("LOSSES: ",losses,col=mid),end="\n")
    winloss = wins/(wins+losses) * 100
    print('{0:>{col}s} {1:<.3f}{2:<1s}'.format("W/L RATIO: ",winloss,"%",col=mid),end="\n")
    games = wins + losses + ties
    print('\n{0:>{col}s} {1:<2.0f}'.format("GAMES: ",games,col=mid),end="\n")
    tf.dl('','/','/')
    print('\n')
    sys.exit()
        
if startMove == '3': # End Game Option.
    print('\n')
    tf.dl(' GOODBYE! ','/','/')
    print('\n')
    sys.exit()