# https://pypi.org/project/PyDictionary/

"""
To Do:
    Find a way to use web scraping to replace PyDictionary
    - Dictionary.com
    - Thesaurus.com
    - Synonym.com
"""

from PyDictionary import PyDictionary
import string
import re
import os
import colorama
from colorama import Fore, Style

blue = Fore.BLUE + Style.BRIGHT     # Blue
cyan = Fore.CYAN + Style.BRIGHT     # Cyan
red = Fore.RED + Style.BRIGHT       # Red
yellow = Fore.YELLOW + Style.BRIGHT # Yellow
green = Fore.GREEN + Style.BRIGHT   # Green
white = Fore.WHITE + Style.BRIGHT   # White
reset = Style.RESET_ALL             # Resets all colors

def new_line():
    print('\n')

def g(val): # Turns a string green
    x = green + str(val) + reset
    return x
def y(val): # turns a string yellow
    y = yellow + str(val) + reset
    return y
def r(val): # turns a string red
    r = red + str(val) + reset
    return r
def line(title): # Divider line with a centered string
    print("\n<{0:-^{col}}>\n".format(title,col=(col-2)))            

tsize = os.get_terminal_size()
col = int(tsize.columns)
h = int(col/2)
row = int(tsize.lines)
dict = PyDictionary()
char = string.punctuation

def mean(word):
    
    output = dict.meaning(word)
    if output == None:
        print(r("Error: No results found"))
        exit()
    print('\nPyDictionary:\n',r(output))

    if output.get('Noun') is not None:
        line('[ NOUN ]')
        count_1 = 0
        for i in output.get('Noun'):
            count_1 += 1
            print(y("{0:>3}:").format(count_1),i)

    if output.get('Verb') is not None:
        line('[ VERB ]')
        count_2= 0
        for i in output.get('Verb'):
            count_2 += 1
            print(y("{0:>3}:").format(count_2),i)

    if output.get('Adjective') is not None:
        line('[ ADJECTIVE ]')
        count_3 = 0
        for i in output.get('Adjective'):
            count_3 += 1
            print(y("{0:>3}:").format(count_3),i)

    if output.get('Adverb') is not None:
        line('[ ADVERB ]')
        count_4 = 0
        for i in output.get('Adverb'):
            count_4 += 1
            print(y("{0:>3}:").format(count_4),i)    

    line("")

word = input('\nChoose a word: '+yellow)
mean(word) # Prints the meaning of the specified word
