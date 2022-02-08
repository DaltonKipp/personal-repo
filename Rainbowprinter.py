import os
import random, sys
import time, sys
import colorama
from colorama import Fore, Style
from colorama.ansi import clear_line, clear_screen

blue = Fore.BLUE + Style.BRIGHT        # Blue
cyan = Fore.CYAN + Style.BRIGHT        # Cyan
red = Fore.RED + Style.BRIGHT          # Red
magenta = Fore.MAGENTA + Style.BRIGHT  # Magenta
yellow = Fore.YELLOW + Style.BRIGHT    # Yellow
green = Fore.GREEN + Style.BRIGHT      # Green
white = Fore.WHITE + Style.BRIGHT      # White
reset = Style.RESET_ALL                # Resets all colors

# TODO: ADD WORD / CHARACTER MODE
#       CHANGE COLOR TO RGB VALUES
#       CONTROL SPEED OF WHILE LOOP
#       CHOOSE COLORS FOR THE LOOP
#       FIND A USE FOR THE TERMINAL WINDOW SIZE
#       COLOR MODES (RGB,RED BLUE, RAINBOW)

# word = str(input("Choose a word to repeat: ")) # Choose the wors that will print
res = int(input("Resolution (by space): ")) # Length of the colors and spaces between them

colorMatrix = [red,yellow,green,cyan,blue,magenta,white] # Color Array for Randomizing
length = len(colorMatrix) # Length of the color matrix
columns,rows = os.get_terminal_size() # Finds the columns and rows of the terminal 
solidBlock = '\u2588'

while True:
    for i in range(0,5):
        #randcolor = random.randint(0,5)
        #print(colorMatrix[randcolor]+ word + reset,end='')
        randcolor = random.randint(0,5)
        print(' '*res+colorMatrix[randcolor]+solidBlock*res+reset,end=' '*(res))