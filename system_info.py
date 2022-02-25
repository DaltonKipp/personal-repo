import os
import subprocess
import platform as sysplatform
import sys
from sys import platform
from screeninfo import get_monitors

def main():
    def new_line():
        print('\n')
        
    new_line()
    line = "\n<{0:-^120s}>" # Separation line format    tsize = os.get_terminal_size()
    
    tsize = os.get_terminal_size()
    col = tsize.columns
    row = tsize.lines
    
    print(line.format("[ TERMINAL INFO ]"))
    print("\n{0:>60s}{1:<60d}\n{2:>60s}{3:<60d}".format('ROWS: ',row,'COLUMNS: ',col))
    
    # Prints System Information
    info = sysplatform.uname()
    print(line.format("[ SYSTEM INFO ]"))
    print("\n{0:>60s}{1:<60s}\n{2:>60s}{3:<60s}\n{4:>60s}{5:<60s}\n{6:>60s}{7:<60s}\n{8:>60s}{9:<60s}\n{10:>60s}{11:<60s}".format(
        'OPERATING SYSTEM: ',info.system,'DEVICE NAME: ',info.node,'RELEASE: ',info.release,
        'VERSION: ',info.version,'MACHINE: ',info.machine,'PROCESSOR: ',info.processor))

    # Prints Screen Information
    for m in get_monitors():
        if m.is_primary==True:
            #print('\n')
            print(line.format("[ MONITOR INFO ]"),)
            print("\n[ {0:^s} ][ {1:^s}{2:^d} ][ {3:^s}{4:^d} ][ {5:^s}{6:^d} ][ {7:^s}{8:^d} ]".format(
                'Primary Display','Screen Width: ',m.width,'Screen Height: ',m.height,
                'Width (mm): ',m.width_mm,'Height (mm): ',m.height_mm))
            print(line.format(""))

            i = 2
        if m.is_primary==False:
            print("\n[ {0:^s}{1:^d} ][ {2:^s}{3:^d} ][ {4:^s}{5:^d} ][ {6:^s}{7:^d} ][ {8:^s}{9:^d} ]".format(
                'Display ',i,'Screen Width: ',m.width,'Screen Height: ',m.height,'Width (mm): ',
                m.width_mm,'Height (mm): ',m.height_mm))
            print(line.format(""))
            i = i+1        
    new_line()
    
if __name__ == '__main__':
    exit(main())
