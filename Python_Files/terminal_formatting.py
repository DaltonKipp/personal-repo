import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
from tkinter import W
import colorama
from colorama import Fore, Style

reset = Style.RESET_ALL             # Resets all colors
def g(val): # Turns a string green
    green = Fore.GREEN + Style.BRIGHT   # Green
    g = green + str(val) + reset
    return g
def y(val): # turns a string yellow
    yellow = Fore.YELLOW + Style.BRIGHT # Yellow
    y = yellow + str(val) + reset
    return y
def r(val): # Turns a string red
    red = Fore.RED + Style.BRIGHT       # Red
    r = red + str(val) + reset
    return r
def b(val): # turns a string blue
    blue = Fore.BLUE + Style.BRIGHT     # Blue
    b = blue + str(val) + reset
    return b
def c(val): # turns a string cyan
    cyan = Fore.CYAN + Style.BRIGHT     # Cyan
    c = cyan + str(val) + reset
    return c
def w(val): # turns a string white
    white = Fore.WHITE + Style.BRIGHT   # White
    w = white + str(val) + reset
    return W

def cl(): # Manages clearing the terminal screen based on OS
    if sysplatform.system() == 'Windows':
        os.system('cls')
    else:
        os.system('clear')     

def dl(title,div,end): # Divider line with a centered string
    print("\n{end}{0:{div}^{col}}{end}".format(title,end=end,div=div,col=(col-2)))
    
def nl():
    print('\n')        

tsize = os.get_terminal_size()
col = int(tsize.columns)
h = int(col/2)
row = int(tsize.lines)