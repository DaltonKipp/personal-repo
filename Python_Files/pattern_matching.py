# AUTOMATE THE BORING STUFF
# CHAPTER 7 - PATTERN MATCHING WITH REGUALR EXPRESSIONS

import re        # Imports Regex
import pyperclip # Imports pyperclip - copies to clipboard

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
    for i in range(8,12): # last three digits
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
match_objects = PhoneNumRegex.search('\nMy number is: (412)-343-5467.')
print('\nRegex --> Phone Number: '+ match_objects.group())
print('\nRegex -->    Area Code: '+ match_objects.group(1))
print('\nRegex -->       Number: '+ match_objects.group(2) + '\n')


phoneRegex = re.compile(r'''(     # PHONE NUMBER REGEX
    (\d{3}|\(\d{3}\))?            # Finds the area code
    (\s|-|\.)?                    # Finds the separator
    \d{3}                         # Finds the first 3 digits
    (\s|-|\.)                     # Finds the separator
    \d{4}                         # Finds the last 4 digits
    (\s*(ext|x|ext.)\s*\d{2,5})?  # Finds the extension
    )''', re.VERBOSE)

EmailRegex = re.compile(r'''    # EMAIL REGEX
            ([a-zA-Z0-9._%+-]+) # Finds the username
            @                   # Seaparated by @
            [a-zA-z0-9.-]+      # Finds domain name
            (\.[a-zA-Z]{2,4})   # .something
            ''',re.VERBOSE)

matchEmail = EmailRegex.search('\nMy email is: dalton8kipp.7678@gmail.com and my other email is dk@dk.com')
print('Email: ' + matchEmail.group())
