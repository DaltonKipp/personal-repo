import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
from screeninfo import get_monitors

def main():
    def new_line():
        print('\n')

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
    print("\n{0:>{h}s}{1:<{h}d}\n{2:>{h}s}{3:<{h}d}"
          .format('ROWS: ',row,'COLUMNS: ',col,h=h))
    
    # Prints System Information
    info = sysplatform.uname()
    div_line("[ SYSTEM INFO ]")
    print('\n{0:>{h}s}{1:<{h}s}\n{2:>{h}s}{3:<{h}s}\n{4:>{h}s}{5:<{h}s}\n{6:>{h}s}{7:<{h}s}\n{8:>{h}s}{9:<{h}s}\n{10:>{h}s}{11:<{h}s}'
        .format('OPERATING SYSTEM: ',info.system,'DEVICE NAME: ',info.node,'OS RELEASE: ',
        info.release,'VERSION: ',info.version,'MACHINE: ',info.machine,'PROCESSOR: ',
        info.processor,h=h))

    # Prints Monitor Information        
    div_line("[ MONITOR INFO ]")
    for m in get_monitors():
        if m.is_primary==True:
            print('\n{0:^{c}}\n\n{1:>{h}}{2:}p\n{3:>{h}}{4:}p\n{5:>{h}}{6:}mm\n{7:>{h}}{8:}mm'
                .format('PRIMARY DISPLAY ','SCREEN WIDTH: ',m.width,'SCREEN HEIGHT: ',
                m.height,'WIDTH: ',m.width_mm,'HEIGHT: ',m.height_mm,h=h,c=col))
            div_line("")

    for m in get_monitors():
        i = 2
        if m.is_primary==False:
            print('\n{0:>{h}}{1:<{h}}\n\n{2:>{h}}{3:}p\n{4:>{h}}{5:}p\n{6:>{h}}{7:}mm\n{8:>{h}}{9:}mm'
                .format('DISPLAY ',i,'SCREEN WIDTH: ',m.width,'SCREEN HEIGHT: ',m.height,'WIDTH: ',
                m.width_mm,'HEIGHT: ',m.height_mm,h=h))
            div_line("")
            i = i+1        
    new_line()

if __name__ == '__main__':
    sys.exit(main())
