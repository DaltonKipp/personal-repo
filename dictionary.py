# https://pypi.org/project/PyDictionary/
from PyDictionary import Pydictionary
dict = PyDictionary()
def meaning(word):
    print(dict.meaning(str(word)))
def synonym(word):
    print(dict.synonym(str(word)))
def antonym(word):
    print(dict.antonym(str(word)))
def synonym(word,transl):
    print(dict.translate(str(word),str(transl)))