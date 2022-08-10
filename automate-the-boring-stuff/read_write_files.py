# AUTOMATE THE BORING STUFF
# CHAPTER 9 - READING AND WRITING FILES

#! python3
# randomQuizGenerator.py - Creates quizzes with questions and answers in random order, along with a key

from pathlib import Path
import os
import random

'''

Path.cwd()     --> Returns current working directory
os.chdir()     --> Changes the current working directory
os.mkdirs()    --> Makes a new directory
Path().mkdir() --> Makes a new directory

os.path.abspath(<path>)         --> Returns a string of the absolute path given a relative path
os.path.siabs(<path>)           --> Returns a boolean whether the path is absolute or not
os.path.relpath(<path>,<start>) --> Returns a string of the relative path from the starting path. Current directory is used if start is not given.
os.path.split(<path>)           --> Splits the given path into a list of strings
os.path.getsize(<path>)         --> Returns the size of the file in the given path in bytes (number)
os.listdir(<path>)              --> Returns a list of filename strings within the given path

p = Path('C:/Users/Al/spam.txt')       --> Example file path
p.ancher == 'C:\\'                     --> Returns the nchor of the path
p.parent == WindowsPath('C:/Users/Al') --> Returns Windows Path object
p.parents[3] == WindowsPath('C:/')     --> Returns the 3rd level Windows Path
p.name == 'spam.txt'                   --> Returns name of the file with suffix
p.suffix == '.txt'                     --> Returns string of the file's suffix
p.drive == 'C:'                        --> Returns the drive
p.glob('*') == <generator object>      --> Returns a generator of ALL(*) files stored in p
p.glob('*.txt')                        --> Returns a generator of all .txt files stored in p
p.glob('file?.docx')                   --> Returns all matching files where ? can be any single character
p.exists() == boolean                  --> Returns True/False if the path exists
p.isfile() == boolean                  --> Returns True/False if the file exists
p.isdir() == boolean                   --> Returns True/False if the directory exists

p.read() // p.open() // p.write() --> Read / Open / Write a file
p.write_text('')                  --> Writes text to a .txt file
p.read_text('')                   --> Reads text from a file

helloFile = open(Path.home() / 'hello.txt')
helloContent = helloFile.read()
print(helloContent)
sonnetFile = open(Path.home() / 'sonnet29.txt')
print(sonnetFile.readlines())

baconFile = open('bacon.txt','w')
baconFile.write('\nHello, world!\n')
baconFile.close()
baconFile = open('bacon.txt','a')
baconFile.write('Bacon is not a vegetable\n')
baconFile.close()
baconFile = open('bacon.txt')
content = baconFile.read()
baconFile.close()
print(content)

'''

# Quiz Dictionary with States and Capitals
capitals={'Alabama':'Montgomery','Alaska':'Juneau','Arizona':'Phoenix','Arkansas':
'Little Rock','California':'Sacramento','Colorado':'Denver','Connecticut':'Hartford',
'Delaware':'Dover','Florida':'Tallahassee','Georgia':'Atlanta','Hawaii':'Honolulu',
'Idaho':'Boise','Illinois':'Springfield','Indiana':'Indianapolis','Iowa':'Des Moines',
'Kansas':'Topeka','Kentucky':'Frankfort','Louisiana':'Baton Rouge','Maine':'Augusta',
'Maryland':'Annapolis','Massachusetts':'Boston','Michigan':'Lansing','Minnesota':
'Saint Paul','Mississippi':'Jackson','Missouri':'Jefferson City','Montana':'Helena',
'Nebraska':'Lincoln','Nevada':'Carson City','New Hampshire':'Concord','New Jersey':
'Trenton','New Mexico':'Santa Fe','New York':'Albany','North Carolina':'Raleigh',
'North Dakota':'Bismarck','Ohio':'Columbus','Oklahoma':'Oklahoma City','Oregon':'Salem',
'Pennsylvania':'Harrisburg','Rhode Island':'Providence','South Carolina':'Columbia',
'South Dakota':'Pierre','Tennessee':'Nashville','Texas':'Austin','Utah':'Salt Lake City',
'Vermont':'Montpelier','Virginia':'Richmond','Washington':'Olympia','West Virginia':
'Charleston','Wisconsin':'Madison','Wyoming':'Cheyenne'}

os.chdir('./quiz_files')

for quizNum in range(0,35):                                                # Makes 35 tests and 35 answer keys 
    
    quizFile = open(f'capitals_quiz_{quizNum +1}.txt','w')                 # Creates the quiz file
    answerKeyFile = open(f'capitals_quiz_answer_key_{quizNum +1}.txt','w') # Creates the answer key file
    
    quizFile.write('\nName:\n\nDate:\n\nPeriod:\n\n')                      # Writes Name, Date, and Period at the top of the file
    quizFile.write(('_'*80)+'\n\n')                                        # Writes a divider line
    quizFile.write((' '*20)+f'State Capitals Quiz (Form {quizNum +1})')    # Writes Title
    quizFile.write('\n\n')                                                 # Empty Lines
    
    states = list(capitals.keys())                                         # Creates a list of the states
    random.shuffle(states)                                                 # Randomly shuffles the state list

    for questionNum in range(0,50):                                         # Occurs for each state
        correctAnswer = capitals[states[questionNum]]                       # Capital answer is set to the index of the state
        wrongAnswers = list(capitals.values())                              # Creates the list of wrong answers
        del wrongAnswers[wrongAnswers.index(correctAnswer)]                 # Deletes the right answers from the wrong answer list
        wrongAnswers = random.sample(wrongAnswers,3)                        # Finds 3 random wrong answers
        answerOptions = wrongAnswers + [correctAnswer]                      # Makes answer list
        random.shuffle(answerOptions)                                       # Shuffles order of answer list
        
        quizFile.write(f'[{questionNum + 1}] - What is the capital of {states[questionNum]}?\n\n') # Writes unique quiz
        
        for i in range(4):                                               # Makes options A, B, C, and D
            quizFile.write(f"        {'ABCD'[i]}. {answerOptions[i]}\n") # Writes Letter with index of answerOptions
            quizFile.write('\n')                                         # Blank line
        
        answerKeyFile.write(f"{questionNum+1}. {'ABCD'[answerOptions.index(correctAnswer)]}")  # Writes answer to key file
        answerKeyFile.write('\n') # Next line

quizFile.close()
answerKeyFile.close()
