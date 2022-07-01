# Wordle Clone
import sys
sys.path.append('C:/Users/nomad/personal-repo/Python_Files')
import terminal_formatting as tf
import colorama
from colorama import Back, Fore, Style
import random
from random import choice
from words import word_list

b   = Fore.BLUE + Style.BRIGHT   # Blue
c   = Fore.CYAN + Style.BRIGHT   # Cyan
r   = Fore.RED + Style.BRIGHT    # Red
y   = Fore.YELLOW + Style.BRIGHT # Yellow
g   = Fore.GREEN + Style.BRIGHT  # Green
w   = Fore.WHITE + Style.BRIGHT  # White
bgB = Back.BLUE                  # Blue text background
bgC = Back.CYAN                  # Cyan text background
bgR = Back.RED                   # Red text background
bgY = Back.YELLOW                # Yellow text background
bgG = Back.GREEN                 # Green text background
bgW = Back.WHITE                 # White text background
rst = Style.RESET_ALL            # Resets all formatting

SQUARES = {                  # Dictionary for pattern squares
    'correct_place': '\u1F7E9',
    'correct_letter': '\u1F7E8',
    'incorrect_letter': '\u2B1C'
}

ALLOWED_GUESSES = 6

def correct_place(letter):     # Correct letter placement printout
    return bgG + tf.bk(letter) # Green background with black text

def correct_letter(letter):    # Correct letter, incorrect place printout
    return bgY + tf.bk(letter) # Yellow background with black text

def incorrect_letter(letter):  # Incorrect letter (not in the answer) printout
    return bgW + tf.bk(letter) # White background with black text

def check_guess(guess,answer):
    guessed = []                                     # Empty list
    wordle_pattern = []                                   # Empty list
    for i, letter in enumerate(guess):
        if answer[i] == guess[i]:
            guessed += correct_place(letter)
            wordle_pattern.append(SQUARES['correct_place'])
        elif letter in answer:
            guessed += correct_letter(letter)
            wordle_pattern.append(SQUARES['correct_letter'])
        else:
            guessed += incorrect_letter(letter)                # 
            wordle_pattern.append(SQUARES['incorrect_letter']) # Adds incorrect letter to squares grid
    return ''.join(guessed), ''.join(wordle_pattern)

def game(chosen_word):       # Input the chosen answer word
    
    end_of_game = False      # When set to True the game will end
    already_guessed = []     # Empty list of guesses
    full_wordle_pattern = [] # Empty list of wordle pattern
    all_words_guessed = []   # Empty list of guessed words
    
    while not end_of_game:
        guess =  str.upper(input(rst+'Choose a starting guess: '+y))     # Input starting guess
        while len(guess) != 5 or guess in already_guessed:               # If the guess is not 5 letters or was already guessed
            if guess in already_guessed:                                 # Already guessed word
                print(tf.r('You have already guessed this word'))        # Info message
            else:                                                        # If the word is not 5 letters
                print(tf.r('Your guess must be a five letter word'))     # Info message
            guess =  str.upper(input(rst+'Choose a starting guess: '+y)) # Input starting guess

        already_guessed.append(guess)                                # Add guess to the list of guessed words
        guessed, pattern = check_guess(guess, chosen_word)           # Output of check_guess == guessed, pattern
        all_words_guessed.append(guessed)                            # Adds guessed words to all words guessed list
        full_wordle_pattern.append(pattern)                          # Adds squares to the wordle pattern
        print(all_words_guessed,sep='\n')                            # Prints all previously guessed words
        
        if guess == chosen_word or len(already_guessed) == ALLOWED_GUESSES:  # If the guess is the chosen word or the tries limit is reached
            end_of_game == True                                              # Ends the while loop
        
        if len(already_guessed) == ALLOWED_GUESSES and guess != chosen_word: # If the turn limit is reached
            print(tf.r('Wordle {}/{}'.format(ALLOWED_GUESSES,ALLOWED_GUESSES)))        # Print that all guesses have been reached  
            print(tf.g('Correct word: {}'.format(chosen_word)))                       # Print the correct word
        
        else:                                                                # If the correct word was found before the turn limit
            tries = len(already_guessed)                                     # Number of tries it took to find the word
            print(tf.g('WORDLE {0}/{1}'.format(tries,ALLOWED_GUESSES)))                  # Shows the number of tries out of the allowed amount
        
        print(full_wordle_pattern,sep='\n')                              # Shows the wordle square pattern
            
if __name__ == '__main__':
    chosen_word = choice(word_list)                      # Chooses a random word from the word list
    tf.cl(), tf.dl(' [ W O R D L E ] ','/','+'), tf.nl() # Title message
    game(chosen_word)                                    # Starts the game
            

# tf.cl(), tf.dl(' [ E N D  G A M E ] ','/','+'), tf.nl()

# Highlight matching / unmatching letters

# Move to next guess

