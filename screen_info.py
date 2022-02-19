import tkinter as tk
import screeninfo
from screeninfo import get_monitors

def main():
    # for m in get_monitors():
    #    print('\n'+str(m)+'\n')

    # Gets screen dimensions from primary monitor
    for m in get_monitors():
        if m.is_primary==True:
            print('\n')
            print('{0:-^120s}'.format(""),) # SEPARATION LINE
            print("[{0:^19s}][{1:^16s}{2:^6d}][{3:^17s}{4:^6d}][{5:^16s}{6:^6d}][{7:^17s}{8:^6d}]".format(
                'Primary Display','Screen Width: ',m.width,'Screen Height: ',m.height,'Width (mm): ',m.width_mm,'Height (mm): ',m.height_mm))
            print('{0:-^120s}'.format(""),) # SEPARATION LINE

        if m.is_primary==False:
            i = 2
            print("[{0:^11s}{1:^8d}][{2:^16s}{3:^6d}][{4:^17s}{5:^6d}][{6:^16s}{7:^6d}][{8:^17s}{9:^6d}]".format(
                'Display',i,'Screen Width: ',m.width,'Screen Height: ',m.height,'Width (mm): ',m.width_mm,'Height (mm): ',m.height_mm))
            print('{0:-^120s}'.format(""),) # SEPARATION LINE
            i = i+1
    print('\n')
if __name__ == '__main__':
    exit(main())