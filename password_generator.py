# PASSWORD GENERATOR
import string
import random
import re

def main():
    
    # Choose the length of the password
    length = int(input('\nHow many characters long will the password be? (Suggested 16+): '))
    # Choose the number of generated passwords
    inst = int(input('How many different passwords would you like to generate?: ')) 
    
    numb = string.digits        # String of numbers
    char = string.punctuation   # String of special characters
    alph = string.ascii_letters # String of lowercase and uppercase letters
    
    print('\nHere are [ ' + str(inst) + ' ] different [ ' + str(length) + ' ] character generated password(s): \n')

    for x in range(0,inst):                         # Generates specified number of passwords
        store = []                                  # Generated character storage
        for y in range(0,100):                      # Generates 100 of each character type
            rn = random.randrange(0,len(numb))      # Random integer for numbers
            rs = random.randrange(0,len(char))      # Random integer for special characters
            ra = random.randrange(0,len(alph))      # Random integer for lowercase letters
            RA = random.randrange(0,len(alph))      # Random integer for uppercase letters
            store.append(str(numb[rn]))             # Adds random number to the list
            store.append(str(char[rs]))             # Adds random special character to the list
            store.append(str(alph[ra]))             # Adds random lowercase letter to the list
            store.append(str(alph[RA]).upper())     # Adds random uppercase letter to the list
            store_password = []                     # New Password Storage
            for z in range(0,length):               # Chooses characters for password from storage
                rx = random.randrange(0,len(store)) # Random slot in store
                store_password.append(store[rx])    # Adds characters to the list
        password = ''.join(store_password)          # Converts password to a string
        print('[ {0:<s} ]'.format(str(x+1),))       # Password counter
        print(password)                             # Prints password
        print('\n')                                 # New line
        
if __name__ == '__main__':
    exit(main())