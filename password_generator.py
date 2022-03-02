# PASSWORD GENERATOR

""" 
1. ASK FOR THE LENGTH OF THE PASSWORD
        A. DETERMINES STRING LENGTH

2. ASK FOR SPECIAL CHARACTERS
        A. DETERMINE IF THE PASSWORD SHOULD CONTAIN SPECIAL CHARACTERS
            I. DETERMINE COMMONLY ACCEPTED PASSWORDS
        B. CHOOSE WHICH IS DEFAULT

3. PRINT THE PASSWORD(S) (MULTIPLE CHOICES)

-----

1. UPPER CASE
        A. HOW MANY?
    
2. LOWER CASE
    A. HOW MANY VS. CAPITAL LETTERS?

3. NUMBERS
    A. 0-9

4. SPECIAL CHARACTERS

5.  - RANDOM COMBINATIONS OF THE ABOVE
    - MUST INCLUDE ALL OF THE ABOVE
    - NOT TOO MANY OF ONE CATEGORY
    - NOT TOO LITTLE OF ONE CATEGORY
    - CREATE STRINGS/LISTS CONTAINING AVAILBLE NUMBERS, LETTERS, SP CHARACTERS         
"""
from ast import Store
import random

def main():

    length = int(input('\nHow long will the password be?: '))
    inst = int(input('How many different passwords would you like?: '))
    
    numb = [0,1,2,3,4,5,6,7,8,9] # List of Numbers
    char = ['!','@','#','$','%','^','&','*','(',')',':',';','-','_','+','=','~'] # List of special characters
    alph = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q',
            'r','s','t','u','v','w','x','y','z']

    print('\nHere are ' + str(inst) + ' different ' + str(length) + ' character generated password(s): \n')

    for i in range(0,inst):
        store = [] # Generated Character Storage
        for i in range(0,100): # Generates 100 of each type
            rn = random.randrange(0,len(numb))  # Random integer for numbers
            rs = random.randrange(0,len(char))  # Random integer for special characters
            ra = random.randrange(0,len(alph))  # Random integer for lowercase letters
            RA = random.randrange(0,len(alph))  # Random integer for uppercase letters
            store.append(str(numb[rn]))         # Adds random number to the list
            store.append(str(char[rs]))         # Adds random special character to the list
            store.append(str(alph[ra]))         # Adds random lowercase letter to the list
            store.append(str(alph[RA]).upper()) # Adds random uppercase letter to the list
            new_password = [] # New Password Storage
            for i in range(0,length):
                rx = random.randrange(0,len(store))
                new_password.append(store[rx])                      
        print(str(i) + ''.join(new_password))
        print('\n')
    
if __name__ == '__main__':
    exit(main())