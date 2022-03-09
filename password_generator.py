# PASSWORD GENERATOR

"""
    To Do:
    - Write to a .csv file
    - Write to a .json file
    - Write to a .txt file
    - Flags for file write
    - Help flag 
    - Option to name passwords
    - Upload to online storage
    - Check password strength
"""

import string
import random
import csv
import pandas as pd
import colorama
from colorama import Fore, Style
from numpy import append

blue = Fore.BLUE + Style.BRIGHT     # Blue
cyan = Fore.CYAN + Style.BRIGHT     # Cyan
red = Fore.RED + Style.BRIGHT       # Red
yellow = Fore.YELLOW + Style.BRIGHT # Yellow
green = Fore.GREEN + Style.BRIGHT   # Green
white = Fore.WHITE + Style.BRIGHT   # White
reset = Style.RESET_ALL             # Resets all colors

def main():
    
    # Choose the length of the password
    length = int(input('\nHow many characters long will the password be? (Suggested 16+): '+yellow))
    # Choose the number of generated passwords
    inst = int(input(reset+'\nHow many different passwords would you like to generate?: '+yellow)) 
    
    numb = string.digits        # String of numbers
    char = string.punctuation   # String of special characters
    alph = string.ascii_letters # String of lowercase and uppercase letters
    
    length_str = yellow + str(length) + reset
    inst_str = yellow + str(inst) + reset
    print(reset+'\nHere are [ '+inst_str+' ] different [ '+length_str+' ] character generated password(s):\n')
    store_passwords = []                                   # Empty list to store generated passwords
    for x in range(0,inst):                                # Generates specified number of passwords
        store = []                                         # Generated character storage
        for y in range(0,100):                             # Generates 100 of each character type
            rn = random.randrange(0,len(numb))             # Random integer for numbers
            rs = random.randrange(0,len(char))             # Random integer for special characters
            ra = random.randrange(0,25)                    # Random integer for lowercase letters
            RA = random.randrange(25,len(alph))            # Random integer for uppercase letters
            store.append(str(numb[rn]))                    # Adds random number to the list
            store.append(str(char[rs]))                    # Adds random special character to the list
            store.append(str(alph[ra]))                    # Adds random lowercase letter to the list
            store.append(str(alph[RA]).upper())            # Adds random uppercase letter to the list
            generated_list = []                            # New Password Storage
            for z in range(0,length):                      # Chooses characters for password from storage
                rx = random.randrange(0,len(store))        # Random slot in store
                generated_list.append(store[rx])           # Adds characters to the list
        password = green + ''.join(generated_list) + reset # Converts password to a string
        print('{0:>6d} - {1:s}\n'.format(x,password))      # Prints password and counter
        
        store_passwords.append(''.join(generated_list))              # Stores all passwords in a list
    csv_path = './test_files/pandas_test.csv'                        # Defines file path
    dict = {'Password':store_passwords}                              # Csv data dictionary
    data_frame = pd.DataFrame(dict)                                  # Creates data frame
    data_frame.to_csv(csv_path)                                      # Creates CSV file
    print(yellow+'Passwords saved to {0:}\n'.format(csv_path)+reset) # Prints csv file creation confirmation

if __name__ == '__main__':
    exit(main())