import random
import time
import colorama
from colorama import Fore, Style
from colorama.ansi import clear_line

blue = Fore.BLUE + Style.BRIGHT        # Blue
red = Fore.RED + Style.BRIGHT          # Red
yellow = Fore.YELLOW + Style.BRIGHT    # Yellow
green = Fore.GREEN + Style.BRIGHT      # Green
white = Fore.WHITE + Style.BRIGHT      # Green
reset = Style.RESET_ALL                # Resets all colors


# print(blue + '\n\nHello World!' + reset) # Prints Hello World
# print(red +'\nWhat is your name?' + reset) # Print
# myName = input() # Input
# print(Fore.GREEN + '\nIt is good to meet you, ' + myName + '!'+reset)
# print(white + '\nThe length of your name is: '+ yellow + str((str(len(myName)) + ' letters long.'))+reset)
# if len(myName) <= 6:
#     print(yellow + '\nShort Name.')
# elif len(myName) > 6:
#         print(yellow + '\nLong Name.')
# print(Fore.WHITE + '\nWhat is your age?' + green)
# myAge = input()
# print(white + '\nYou will be ' + green + str(int(myAge)+1) + white + ' in a year!\n')
# time.sleep(1)
print('\n\n')
load = 0
while load <= 32:
    load = load + 1
    p = "LOADING [" + load*"%" + (32-load)*"." + "]"
    print (p,end="\r")
    time.sleep(0.1)

print(white + 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+ reset)

y= len('--------- TRY AGAIN! ----------')

name = int(11)
r = int(random.randrange(1,10,1))
while name != r:
       print(white + '\n.....PICK A NUMBER BETWEEN 1 AND 10......\n'+ blue)
       name = int(   input())
       print(white)
       if name != r:
           for i in range(1,y+1,1):
             p = yellow + "LOADING [" + i*"#" + (y-i)*"." + "]"
             print (p,end="\r")
             time.sleep(0.025)
             i=i+1
           print(white)
           time.sleep(0.01)
           print(red + '\n-------------- TRY AGAIN! ---------------' + reset)
           print(white + '\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+ reset)
           time.sleep(0.1)
           print('',end="")
           
for i in range(1,y+1,1):
    p = yellow + "LOADING [" + i*"#" + (y-i)*"." + "]"
    print (p,end="\r")
    time.sleep(0.025)
    i=i+1

print(white + '\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'+ reset)
print(green + '\n+++++++++++++++++++++++++++++++++++++++++\n'+ reset)

for i in range(0,15,1):
    a = green + ".!.!.!. \(^.^\) CORRECT! \(^.^\) .!.!.!." + reset
    print(a,end="\r\r\r")
    time.sleep(0.25)
    b = green + "!.!.!.! (/^.^)/ CORRECT! (/^.^)/ !.!.!.!" + reset
    print(b,end="\r")
    time.sleep(0.25)
    i=i+1
c = green + ".!.!.!. \(^.^)/ CORRECT! \(^.^)/ .!.!.!." + reset
print(c + '\n')
