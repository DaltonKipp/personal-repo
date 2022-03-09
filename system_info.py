import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
from screeninfo import get_monitors
import colorama
from colorama import Fore, Style

blue = Fore.BLUE + Style.BRIGHT     # Blue
cyan = Fore.CYAN + Style.BRIGHT     # Cyan
red = Fore.RED + Style.BRIGHT       # Red
yellow = Fore.YELLOW + Style.BRIGHT # Yellow
green = Fore.GREEN + Style.BRIGHT   # Green
white = Fore.WHITE + Style.BRIGHT   # White
reset = Style.RESET_ALL             # Resets all colors

def main():
    def new_line():
        print('\n')
    
    def g(val): # Turns a string green
        x = green + str(val) + reset
        return x
    def y(val): # turns a string yellow
        y = yellow + str(val) + reset
        return y

    def clear(): # Manages clearing the terminal screen based on OS
        if sysplatform.system() == 'Windows':
            os.system('cls')
        else:
            os.system('clear')     

    def div_line(title): # Divider line with a centered string
        print("\n<{0:-^{col}}>".format(title,col=(col-2)))            

    tsize = os.get_terminal_size()
    col = int(tsize.columns)
    h = int(col/2)
    row = int(tsize.lines)
    
    clear()

    # Prints Terminal Information
    div_line("[ TERMINAL INFO ]")
    print("\n{0:>{h}}{1:<{h}}\n{2:>{h}}{3:<{h}}"
          .format('ROWS: ',g(row),'COLUMNS: ',g(col),h=h))
    
    # Prints System Information
    info = sysplatform.uname()
    div_line("[ SYSTEM INFO ]")
    print('\n{0:>{h}s}{1:<{h}s}\n{2:>{h}s}{3:<{h}s}\n{4:>{h}s}{5:<{h}s}\n{6:>{h}s}{7:<{h}s}\n{8:>{h}s}{9:<{h}s}\n{10:>{h}s}{11:<{h}s}'
        .format('OPERATING SYSTEM: ',g(info.system),'DEVICE NAME: ',g(info.node),'OS RELEASE: ',
        g(info.release),'VERSION: ',g(info.version),'MACHINE: ',g(info.machine),'PROCESSOR: ',
        g(info.processor),h=h))

    # Prints Monitor Information        
    div_line("[ MONITOR INFO ]")
    for m in get_monitors():
        if m.is_primary==True:
            print('\n{0:^{c}}\n\n{1:>{h}}{2:}\n{3:>{h}}{4:}\n{5:>{h}}{6:}\n{7:>{h}}{8:}'
                .format('PRIMARY DISPLAY ','SCREEN WIDTH: ',g(m.width),'SCREEN HEIGHT: ',
                g(m.height),'WIDTH (mm): ',g(m.width_mm),'HEIGHT (mm): ',g(m.height_mm),h=h,c=col))
            div_line("")

    for m in get_monitors():
        i = 2
        if m.is_primary==False:
            print('\n{0:>{h}}{1:<{h}}\n\n{2:>{h}}{3:}\n{4:>{h}}{5:}\n{6:>{h}}{7:}\n{8:>{h}}{9:}'
                .format('DISPLAY ',i,'SCREEN WIDTH: ',g(m.width),'SCREEN HEIGHT: ',g(m.height),'WIDTH (mm): ',
                g(m.width_mm),'HEIGHT (mm): ',g(m.height_mm),h=h))
            div_line("")
            i = i+1        
    new_line()

if __name__ == '__main__':
    sys.exit(main())
