import random, sys
import time
import colorama
from colorama import Fore, Style
from colorama.ansi import clear_line, clear_screen

blue = Fore.BLUE + Style.BRIGHT        # Blue
cyan = Fore.CYAN + Style.BRIGHT        # Cyan
red = Fore.RED + Style.BRIGHT          # Red
yellow = Fore.YELLOW + Style.BRIGHT    # Yellow
green = Fore.GREEN + Style.BRIGHT      # Green
white = Fore.WHITE + Style.BRIGHT      # White
reset = Style.RESET_ALL                # Resets all colors

print('{0:=^60s}'.format(""),end="\n\n") # SEPARATION LINE
print('{0:^60s}'.format("ROCK / PAPER / SCISSORS"),end="\n\n") # Game title

space = print('\n')

# Initial values
wins = 0
losses = 0
ties = 0


while True: # Start Menu while loop
    print('{0:^60s}'.format("START GAME: (1)"),end="\n\n")
    print('{0:^60s}'.format(" AUTO MODE: (2)"),end="\n\n")
    print('{0:^60s}'.format("  END GAME: (3)"),end="\n\n")
    startMove = input('                             ')
    if startMove == '1': # Breaks the loop foran accepted answer
        break
    if startMove == '2':
        break
    if startMove == '3':
        break
    elif startMove != '1' or '2' or '3': # Restarts the loop for an unaccepted answer
        print('\n')
        error = red + 'ERROR: PLEASE CHOOSE (1), (2), or (3)' + reset
        print('{0:^60s}'.format(error),end='\n\n')

while startMove == '1': # Start Game Option.
    print(white)
    print("{0:^9s}{1:^9}//{2:^9}{3:^9}//{4:^10s}{5:^10}".format("WINS:",wins,"LOSSES:",losses,"TIES:",ties))

    while True: # The player input loop.
        print(white + '\n------------------------------------------------------------')
        print(white + '------------------------------------------------------------\n')
        print('{0:^60s}'.format("Enter your move: (R)ock (P)aper (S)cissors or (Q)uit"),end="\n\n")
        playerMove = input('                             ')
        print('\n')

        if playerMove == 'q' or playerMove == 'Q':

            if wins == 0 and ties == 0 and losses == 0:
                print('{0:^60s}'.format(("GOODBYE!"),end="\n\n"))
                print('\n')
                sys.exit()
            print('{0:=^60s}'.format((""),end="\n\n"))
            print('\n')
            print('{0:^60s}'.format("F I N A L  S C O R E"))
            print('\n')
            print('{0:>30s}{1:<30}'.format("WINS:  ",wins),end="\n\n")
            print('{0:>30s}{1:<30}'.format("TIES:  ",ties),end="\n\n")
            print('{0:>30s}{1:<30}'.format("LOSSES:  ",losses),end="\n\n")
            games = wins + losses + ties
            print('{0:>30s}{1:<2.0f}'.format("GAMES:  ",games),end="\n\n")
            
            if wins == 0 and losses == 0:
                print('\n')
                print('{0:=^60s}'.format((" ENDING GAME "),end="\n\n"))
            
            if wins != 0 or losses != 0: 
                winloss = wins/(wins+losses) * 100
                print('{0:>30s}{1:<2.0f}{2:<1s}'.format("W/L RATIO:  ",winloss," %"),end="\n\n")
                print('\n')
                print('{0:=^60s}'.format((" ENDING GAME "),end="\n\n"))
            
            print('\n')    
            sys.exit() # Quit the program.
        
        if playerMove == 'r' or playerMove == 'R' or playerMove == 'P' or playerMove == 'p' or playerMove == 'S' or playerMove == 's':
            break # Break out of the player input loop.
        valid = red + '"' + playerMove + '"' + ' is not a valid input' + reset
        print('{0:^60s}'.format(valid),end="\n")
        
    load = 3 # VS load loop

    if playerMove == 'r' or playerMove == 'R':
        print('{0:^60s}'.format("ROCK"))
        print('\n')
        for i in range(1,load+1,1):
            time.sleep(0.25)
            p = white + "                             VS" + "."*i + reset
            print('{0:^.60s}'.format(p),end="\r")
            time.sleep(0.25)
            i=i+1
    elif playerMove == 'p' or playerMove == 'P':
        print('{0:^60s}'.format("PAPER"),end="\n")
        print('\n')
        time.sleep(0.25)
        for i in range(1,load+1,1):
            p = white + "                             VS" + "."*i + reset
            print (p,end="\r".format(p))
            time.sleep(0.25)
            i=i+1
    elif playerMove == 's' or playerMove == 'S':
        print('{0:^60s}'.format("SCISSORS"),end="\n")
        print('\n')
        time.sleep(0.25)
        for i in range(1,load+1,1):
            p = white + "                             VS" + "."*i + reset
            print (p,end="\r")
            time.sleep(0.25)
            i=i+1
    print("\n\n")

    # Display what the computer chose:
    randomNumber = random.randint(1, 3)
    if randomNumber == 1:
        computerMove = 'r'
        print('{0:^60s}'.format("ROCK"),end="\n\n")
    elif randomNumber == 2:
        computerMove = 'p'
        print('{0:^60s}'.format("PAPER"),end="\n\n")
    elif randomNumber == 3:
        computerMove = 's'
        print('{0:^60s}'.format("SCISSORS"),end="\n\n")

    win  = green + "YOU WON!"   # Win String
    tie  = yellow + "YOU TIED!" # Tie String
    loss = red + "YOU LOST!"    # Loss String

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
    space
    print('{0:^60s}'.format("How many games do you want to simulate?"),end="\n\n") # Start message
    games = int(input('                            '))
    print('\n')
    print('{0:=^60s}'.format((" START "),end="\n\n"))
    print('{0:<13s}{1:^12s}{2:^12s}{3:^12s}{4:^5s}{5:^5}'.format("GAME","USER MOVE","VS.","COMPUTER MOVE","","TALLY"))

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

        win  = green + " WIN" + reset   # Win String
        tie  = yellow + " TIE" + reset # Tie String
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

        print('#{0:<12s}{1:<12s}{2:^12s}{3:<12s}{4:^7s}{5:>5}'.format(g,userMove,"VS.",computerMove,"",tally))
        #time.sleep(0.001)
        i = i+1
    print('{0:=^60s}'.format((" END "),end="\n\n"))

    print('\n')
    print('{0:>30s}{1:<30s}'.format("F I N A L "," S C O R E"))
    print('\n')
    print('{0:>30s} {1:<30}'.format("WINS: ",wins),end="\n\n")
    print('{0:>30s} {1:<30}'.format("TIES: ",ties),end="\n\n")
    print('{0:>30s} {1:<30}'.format("LOSSES: ",losses),end="\n\n")
    winloss = wins/(wins+losses) * 100
    print('{0:>30s} {1:<2.3f}{2:<1s}'.format("W/L RATIO: ",winloss,"%"),end="\n\n")
    games = wins + losses + ties
    print('{0:>30s} {1:<2.0f}'.format("GAMES: ",games),end="\n\n")
    print('{0:=^60s}'.format((""),end="\n\n"))
    print('\n')
    sys.exit()
        
if startMove == '3': # End Game Option.
    print('\n')
    print('{0:^60s}'.format(("GOODBYE!"),end="\n\\n"))
    print('{0:=^60s}'.format(""),end="\n\n") # SEPARATION LINE
    print('\n')
    sys.exit()