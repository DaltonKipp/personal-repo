import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
import colorama
from colorama import Fore, Style

blue = Fore.BLUE + Style.BRIGHT     # Blue
cyan = Fore.CYAN + Style.BRIGHT     # Cyan
red = Fore.RED + Style.BRIGHT       # Red
yellow = Fore.YELLOW + Style.BRIGHT # Yellow
green = Fore.GREEN + Style.BRIGHT   # Green
white = Fore.WHITE + Style.BRIGHT   # White
reset = Style.RESET_ALL             # Resets all colors

color = str(input('color: '))
string = str(input('string: '))

def c(color,string):

    if color == 'b':
        ret = blue + string + reset
        return ret
    else:
        print('Error')
        