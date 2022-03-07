# https://pypi.org/project/PyDictionary/
from PyDictionary import PyDictionary

dict = PyDictionary()

def mean(word):
    print(dict.meaning(str(word)))

def syn(word):
    if dict.synonym(str(word)) == None:
        print('This word does not have a synonym')
    else:
        print(dict.synonym(str(word)))

def ant(word):
    if dict.antonym(str(word)) == None:
        print('This word does not have an antonym')
    else:
        print(dict.antonym(str(word)))
        
def tran(word,transl):
    print(dict.translate(str(word),str(transl)))

word = input('Choose a word: ')
mean(word) # Prints the meaning of the specified word
syn(word) # Prints the synonym of the specified word
ant(word) # Prints the antonym of the specified word