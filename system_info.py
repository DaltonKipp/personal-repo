import platform
import tkinter as tk
import screeninfo
from screeninfo import get_monitors

def main():
    i = 0
    # Prints Screen Information
    for m in get_monitors():
        i += 1 
        istr = "[ " + str(i) + " ]"
        print("\n<{0:-^120s}>".format(istr))
        print('\n'+str(m)+'\n')
    
    # Prints System Information
    info = platform.uname()
    print("<{0:-^120s}>".format("[ SYSTEM INFO ]"))
    print("\n{0:>60s}{1:<60s}\n{2:>60s}{3:<60s}\n{4:>60s}{5:<60s}\n{6:>60s}{7:<60s}\n{8:>60s}{9:<60s}\n{10:>60s}{11:<60s}\n".format(
        'OPERATING SYSTEM: ',info.system,'DEVICE NAME: ',info.node,'RELEASE: ',info.release,'VERSION: ',info.version,'MACHINE: ',info.machine,'PROCESSOR: ',info.processor))        
    
    # Prints Screen Information
    for m in get_monitors():
        if m.is_primary==True:
            #print('\n')
            print('<{0:-^120s}>'.format(""),)
            print("[ {0:^s} ][ {1:^s}{2:^d} ][ {3:^s}{4:^d} ][ {5:^s}{6:^d} ][ {7:^s}{8:^d} ]".format(
                'Primary Display','Screen Width:',m.width,'Screen Height:',m.height,'Width(mm):',m.width_mm,'Height(mm):',m.height_mm))
            print('<{0:-^120s}>'.format(""))

            i = 2
        if m.is_primary==False:
            print("[ {0:^s}{1:^d} ][ {2:^s}{3:^d} ][ {4:^s}{5:^d} ][ {6:^s}{7:^d} ][ {8:^s}{9:^d} ]".format(
                'Display ',i,'Screen Width:',m.width,'Screen Height:',m.height,'Width(mm):',m.width_mm,'Height(mm):',m.height_mm))
            print('<{0:-^120s}>'.format(""))
            i = i+1
    print('\n')
    
if __name__ == '__main__':
    exit(main())