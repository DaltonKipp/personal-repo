from mailbox import linesep
import os
import random, sys
import time, sys
import colorama
from colorama import Fore, Style
from colorama.ansi import clear_line, clear_screen

blue = Fore.BLUE + Style.BRIGHT         # Blue
cyan = Fore.CYAN + Style.BRIGHT         # Cyan
red = Fore.RED + Style.BRIGHT           # Red
magenta = Fore.MAGENTA + Style.BRIGHT   # Magenta
yellow = Fore.YELLOW + Style.BRIGHT     # Yellow
green = Fore.GREEN + Style.BRIGHT       # Green
white = Fore.WHITE + Style.BRIGHT       # White
reset = Style.RESET_ALL                 # Resets all colors

indent = 0                              # How many spaces to indent.
indentIncreasing = True                 # Whether the indentation is increasing or not.
lines = int(input('Number of lines: ')) # Defines the number of zigzags
linewidth = int(input('LineWidth: '))   # Defines the linewidth
columns,rows = os.get_terminal_size()   # Finds the columns and rows of the terminal 
solidBlock = '\u2588'                   # Solid rectangle character

def zigzag():
    for i in range(0,lines):
        randcolor = random.randint(0,5)                          # Random number between 0 and 5
        colorMatrix = [red,yellow,green,cyan,blue,magenta,white] # Color Array for Randomizing
        print(' ' * indent, end=' ')                             # Spaces * indent counter
        print(colorMatrix[randcolor] + solidBlock*linewidth)     # character * linewidth


try:
    while True: # The main program loop.
        zigzag()
        time.sleep(0.01) # Pause for 1/10 of a second.

        if indentIncreasing:
            # Increase the number of spaces:
            indent = indent + 1
            if indent == columns + linewidth*lines:
                # Change direction:
                indentIncreasing = False

        else:
            # Decrease the number of spaces:
            indent = indent - 1
            if indent == 0:
                # Change direction:
                indentIncreasing = True
except KeyboardInterrupt:
    sys.exit()