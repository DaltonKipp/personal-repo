# AUTOMATE THE BORING STUFF
# CHAPTER 7 - PATTERN MATCHING WITH REGUALR EXPRESSIONS

from os import sep
import re
from turtle import resetscreen   # Imports Regex
import pyperclip                 # Imports pyperclip - copies to clipboard
from colorama import Fore, Style # Text coloring

b = Fore.BLUE + Style.BRIGHT   # Blue
c = Fore.CYAN + Style.BRIGHT   # Cyan
r = Fore.RED + Style.BRIGHT    # Red
y = Fore.YELLOW + Style.BRIGHT # Yellow
g = Fore.GREEN + Style.BRIGHT  # Green
w = Fore.WHITE + Style.BRIGHT  # White
rst = Style.RESET_ALL          # Resets all colors

def isPhoneNumber(text):
    if len(text) != 12: # checks length of string
        return False
    for i in range(0,3): # checks first three characters are numbers
        if not text[i].isdecimal():
            return False
    if text[3] !='-': # checks for hyphen
        return False
    for i in range(4,7): # checks for next three digits
        if not text[i].isdecimal():
            return False
    if text[7] !='-': # hyphen check
        return False
    for i in range(8,12): # last four digits
        if not text[i].isdecimal():
            return False
    return True

print('\nIs 415-555-4242 a phone number?')
print(isPhoneNumber('415-555-4242')) # Prints output of function
print('\nIs Moshi moshi a phone number?')
print(isPhoneNumber('Moshi moshi')) # Prints output of function

message = 'Call me at 415-555-1011 tomorrow. 415-555-9999 is my office.'
print('\nMessage: ' + message)
for i in range (len(message)):
    chunk = message[i:i+12]
    if isPhoneNumber(chunk):
        print('\nPhone number found: ' + chunk)
print('-- Done --')

# Use Regex to accomplish the code above much more simply
PhoneNumRegex = re.compile(r'(\(\d\d\d\))-(\d\d\d-\d\d\d\d)')
match_objects = PhoneNumRegex.search('\nMy number is: (303)-493-1477.')
print('\nRegex --> '+y+'Phone Number: '+g+match_objects.group()+rst)
print('\nRegex -->    '+y+'Area Code: '+g+match_objects.group(1)+rst)
print('\nRegex -->       '+y+'Number: '+g+match_objects.group(2)+'\n'+rst)

phoneRegex = re.compile(r'''(      # PHONE NUMBER REGEX
    (\d{3}|\(\d{3}\))?             # Finds the area code - Matches a digit exactly 3x or alternatively a set of 3 digits between parenthesis between zero and one times (?)
    (\s|-|\.)?                     # Finds the separator - Matches a whitespace character (\s), a dash (-), or a period (.), between zero and one times (?)
    (\d{3})                        # Finds the first 3 digits - Matches a digit exactly three times
    (\s|-|\.)                      # Finds the separator - Matches a space (\s), a dash (-), or a period (.) once
    (\d{4})                        # Finds the last 4 digits - Matches 4 digits exactly once
    (\s*(ext|x|ext.)\s*(\d{2,5}))? # Finds the extension - Matches a whitespace character (\s) zero to inf times (*), 2nd group matches ext|x|ext., whitespace character 0 to inf, digits 2-5 times, 0 to 1 times (?)
    )''', re.VERBOSE)              # Allows the separation of expressions for better visibility

emailRegex = re.compile(r'''(      # EMAIL REGEX
    [a-zA-Z0-9._%+-]+              # Finds the username - Matches any letter (upper or lowercase), digit, character in the list (._%+-), 0 to inf times (+)
    @                              # Seaparated by @ - Matches exactly @ once
    [a-zA-z0-9.-]+                 # Finds domain name - Matches any letter or digit 0 to inf times
    (\.[a-zA-Z]{2,4})              # .something - Matches a period (.) followed by any letter 2-4 times
    )''',re.VERBOSE)               # Allows the separation of expressions for better visibility

Test_Text = '\nMy email is: daltonkipp@gmail.com and my phone number is: (303).493.1477 ext. 22, or my office phone is 303.569.0879' # Sample text

if emailRegex.search(Test_Text):                            # Searches given text for an email
    matchEmail = g+emailRegex.search(Test_Text).group()+rst # Matching phone number
else:
    matchEmail = r+'NOT FOUND'+rst                          # Error message

if phoneRegex.search(Test_Text):                            # Seaches given text for a phone number
    matchPhone = g+phoneRegex.search(Test_Text).group()+rst # Matching phone number
else:
    matchPhone = r+'NOT FOUND'+rst                          # Error Message

print('Email: '+matchEmail+'\nPhone: '+matchPhone)          # Prints the found email and phone number

text = str(pyperclip.paste())                               # Find matches in the clipboard text
matches = []                                                # Creates an empty array for matches

for groups in phoneRegex.findall(text):                     # Sorts through the groups of the phoneRegex
    PhoneNum = '-'.join([groups[1],groups[3],groups[5]])    # Joins groups into one phone number
    if groups[8] != '':                                     # If there is an extension
        PhoneNum += ' ext. ' + groups[8]                    # add the extension
    matches.append(PhoneNum)                                # Add the phone numbers to the matches array

for groups in emailRegex.findall(text):                     # For groups in emailRegex
    matches.append(groups[0])                               # Add emails to matches array

if len(matches) > 0:                                        # If there are matches found...
    pyperclip.copy(g+'\n'.join(matches)+rst)                # Copy the matches to the clipboard
    print(y+'\n\n---- Copied to clipboard ----\n'+rst)      # Confirmation message
    print(g+'\n'.join(matches)+rst,'\n')                    # Prints what was copied to the clipboard

else:
    print('\nNo phone numbers or email addresses found.\n') # Otherwise print message saying there were not any matches

'''
EXAMPLE TEXT
800-420-7240 x 495
415-863-9900 ext. 112
415-863-9950 ext 13
support@nostarch.co
support@nostarch.com
academic@nostarch.co
sales@nostarch.net
conferences@nostarch.cc
errata@nostarch.net
info@nostarch.uk
media@nostarch.c
editors@nostarch.com
'''