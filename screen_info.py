import tkinter as tk
import screeninfo
from screeninfo import get_monitors

def main():
    # Gets Screen Dimensions
    screen = tk.Tk()
    #screenWidth = screen.winfo_screenwidth()
    #screenHeight = screen.winfo_screenheight()
    #print('Screen Height: {}'.format(screenHeight))
    #print('Screen Width: {}'.format(screenWidth))
    for m in get_monitors():
        print('\n'+str(m)+'\n')
    # Gets screen dimensions from primary monitor
    for m in get_monitors():
        if m.is_primary:
            print("\nPrimary Display || Screen Width: {0:^4d}      || Screen Height: {1:^4d}      ||".format(m.width,m.height))
            print("                || Screen Width (mm): {0:^4d} || Screen Height (mm): {1:^4d} ||".format(m.width_mm,m.height_mm))
        if m.is_primary==False:
            i = 2
            print("{0:^8s}{1:^6d} || Screen Width: {2:^4d} || Screen Height: {3:^4d}".format('Display #',i,m.width,m.height))
            i = i+1
        
if __name__ == '__main__':
    exit(main())