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

    def div_line(title): # Divider Line w/ a String in the Middle
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
    print("""\n{0:>{h}s}{1:<{h}s}\n{2:>{h}s}{3:<{h}s}\n{4:>{h}s}{5:<{h}s}
        \n{6:>{h}s}{7:<{h}s}\n{8:>{h}s}{9:<{h}s}\n{10:>{h}s}{11:<{h}s}"""
        .format('OPERATING SYSTEM: ',info.system,'DEVICE NAME: ',info.node,'OS RELEASE: ',
        info.release,'VERSION: ',info.version,'MACHINE: ',info.machine,'PROCESSOR: ',
        info.processor,h=h))

    # Prints Screen Information        
    div_line("[ MONITOR INFO ]")
    for m in get_monitors():
        if m.is_primary==True:
            print("\n[{0:^s}][{1:^s}{2:^d}][{3:^s}{4:^d}][{5:^s}{6:^d}][{7:^s}{8:^d}]"
                  .format('Primary Display','Screen Width:',m.width,'Screen Height:',
                          m.height,'Width(mm):',m.width_mm,'Height(mm):',m.height_mm))
            div_line("")

        i = 2
        if m.is_primary==False:
            print("\n[{0:^s}{1:^d}][{2:^s}{3:^d}][{4:^s}{5:^d}][{6:^s}{7:^d}][{8:^s}{9:^d}]".format(
                'Display ',i,'Screen Width:',m.width,'Screen Height:',m.height,'Width(mm):',
                m.width_mm,'Height (mm):',m.height_mm))
            div_line("")
            i = i+1        
    new_line()

if __name__ == '__main__':
    exit(main())
