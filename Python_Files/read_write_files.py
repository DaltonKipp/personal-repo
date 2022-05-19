# AUTOMATE THE BORING STUFF
# CHAPTER 9 - READING AND WRITING FILES

from pathlib import Path
import os

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
'''