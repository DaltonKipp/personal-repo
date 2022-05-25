import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
from tkinter import W
import colorama
from colorama import Fore, Style

blue = Fore.BLUE + Style.BRIGHT     # Blue
cyan = Fore.CYAN + Style.BRIGHT     # Cyan
red = Fore.RED + Style.BRIGHT       # Red
yellow = Fore.YELLOW + Style.BRIGHT # Yellow
green = Fore.GREEN + Style.BRIGHT   # Green
white = Fore.WHITE + Style.BRIGHT   # White
reset = Style.RESET_ALL             # Resets all colors

def g(val): # Turns a string green
    g = green + str(val) + reset
    return g
def y(val): # turns a string yellow
    y = yellow + str(val) + reset
    return y
def r(val): # Turns a string red
    r = red + str(val) + reset
    return r
def b(val): # turns a string blue
    b = blue + str(val) + reset
    return b
def c(val): # turns a string blue
    c = cyan + str(val) + reset
    return c
def w(val): # turns a string blue
    w = white + str(val) + reset
    return W

def cl(): # Manages clearing the terminal screen based on OS
    if sysplatform.system() == 'Windows':
        os.system('cls')
    else:
        os.system('clear')     

def dl(title): # Divider line with a centered string
    print("\n<{0:-^{col}}>".format(title,col=(col-2)))
    
def nl():
    print('\n')        

tsize = os.get_terminal_size()
col = int(tsize.columns)
h = int(col/2)
row = int(tsize.lines)