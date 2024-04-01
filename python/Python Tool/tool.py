import os, platform, time

#x = "clear"
#os.system(x)

ans=True
while ans:

  #x = "clear"
  #os.system(x)
  print ("""
  Symbot Tools

  ( 1 )  Reload Simba
  ( 2 )  Bot Commands
  ( 3 )  Ping
  ( 4 )  Ion Logs
  ( 5 )  SAM
  ( X )  Clear""")

  ans=raw_input("Please select an option from the list: ")

  if ans=="1":
    print("Reload Simba to Bot")
    host1 = "/opt/bottools/reloadSymbot.sh "
    bot = raw_input("Bot Number: ")
    x = "clear"
    os.system(host1+bot)
    os.system(x)

  if ans=="2":
    print ("""
      Bot Commands

      ( 1 )  Reload Simba
      ( 2 )  Reload Simba to Entire Level
      ( 3 )  Connect to Bot
      ( 4 )  Reload Simba via Connect to Bot
      ( 5 )  Telnet SCPU
      """)

    ans=raw_input("Please select an option from the list: ")

    if ans=="1":
      print("Reload Simba to Bot")
      host1 = "/opt/bottools/reloadSymbot.sh "
      bot = raw_input("Bot Number: ")
      x = "clear"
      os.system(host1+bot)
      os.system(x)

    if ans=="2":
      print("Reload Simba to Entire Level")
      host1 = "/opt/bottools/reloadSymbotLevel.sh "
      num1 = raw_input("Level Number: ")
      os.system(host1+num1)

    if ans=="3":
      c1= "connectToBot "
      bot= raw_input("Bot Number: ")
      os.system(c1+bot)

    if ans=="4":
      c1="connectToBot "
      c2=" /mnt/nfsconfig/Engineering/Simba/autorun.sh"
      bot=raw_input("Bot Number:")
      os.system(c1+bot+c2)

    if ans=="5":
        botid = 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    botid+=1
                    type1 = "telnet saf0"
                    type3 = ".mbot.wmtusksotw01.symbotic"
                    os.system(type1+bot+type3)

                elif bot >= 9999 :
                    botid+=1
                    type1 = "telnet saf"
                    type3 = ".mbot.wmtusksotw01.symbotic"
                    os.system(type1+bot+type3)
            else:
                print('Please input a proper bot ID')
                botid = 0

    #if ans=="8":
      #com="bot "
      #bot=raw_input("Bot Number:")
      #os.system(com+bot)

  if ans=="3":
    print ("""
      Ping Commands

      ( 1 )  Bot Ping 10x
      ( 2 )  Bridge Ping 10x
      ( 3 )  Safety CPU Ping 10x
      ( 4 )  Bot Ping 100x
      ( 5 )  Bridge Ping 100x
      ( 6 )  Safety CPU Ping 100x
      ( 7 )  Bot Ping Continuous """)

    ans3=raw_input("Please select an option from the list: ")

    if ans3=="1":
        botid= 0

        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " bot0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " bot"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
    if ans3=="2":
        botid= 0

        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " brg0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " brg"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
    if ans3=="3":
        botid= 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " saf0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping -c 10 "
                    c2 = " saf"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
    if ans3=="4":
        botid= 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 100 "
                    c2 = " bot0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    botid+=1
                    c1 = "ping -c 100 "
                    c2 = " bot"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
            else :
                print('Please input a proper bot ID')
                botid+=1
    if ans3=="5":
        botid= 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 100 "
                    c2 = " brg0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping -c 100 "
                    c2 = " brg"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
    if ans3=="6":
        botid= 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping -c 100 "
                    c2 = " saf0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping -c 100 "
                    c2 = " saf"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
    if ans3=="7":
        botid= 0
        while botid == 0:
            bot=str(raw_input("Bot Number: "))
            if bot.isdigit():
                bot = int(bot)
                if bot <= 9999 :
                    c1 = "ping "
                    c2 = " bot0"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
                elif bot >= 9999 :
                    c1 = "ping "
                    c2 = " bot"
                    c3 = ".mbot.wmtusksotw01.symbotic "
                    os.system(c1+c2+str(bot)+c3)
                    botid+=1
            else :
                print('Please input a proper bot ID')
                botid = 0
  if ans=="4":
    print ("""
      Ion Logs

      ( 1 )   All E-Codes
      ( 2 )   Specific Hour Grep
      ( 3 )   Check Simba Version
      ( 4 )   Initialize Status & Ecode Check
      ( 5 )   Payload Status Check
      ( 6 )   CAN Bus Fault
      ( 7 )   Disconnect
      ( 8 )   CHD Check
      ( 9 )   User Defined ION Log Grep
      ( 10 )  Ion Log
      ( 11 )  Ion Log by Hour
      """)

    ans=raw_input("Please select an option from the list: ")

    if ans=="1":
      print("Returns All Ecodes Symbot")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'ecode [1-9]...\|event: alarm,\|logtype = alarm'"
      os.system(host4+num1+host5+host6)

    if ans=="2":
      print("ION Log Grep for specific hour")
      dte1 = raw_input("Date: ")
      tme1 = raw_input("Hour: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      grp1 = raw_input("What are you grepping for?: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always '"
      host7 = "'"
      host8 = "|grep -C5 -i --color=always 'T"
      host9 = ":*'"
      os.system(host4+num1+host5+host6+grp1+host7+host8+tme1+host9)

    if ans=="3":
      print("Identifies Simba Version")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'simba,'"
      os.system(host4+num1+host5+host6)

    if ans=="4":
      print("\n Initialize Status & Ecode Check")
      print("\n What date are you searching on?")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'initialize\|ecode\|fail'"
      os.system(host4+num1+host5+host6)

    if ans=="5":
      print("\n Bot Payload Status Check")
      print("\n What date are you searching on?")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'payload\|sku\|casegroup'"
      os.system(host4+num1+host5+host6)

    if ans=="6":
      print("\n CAN Bus Fault Check")
      print("\n What date are you searching on?")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'CANopen\|timeout'"
      os.system(host4+num1+host5+host6)

    if ans=="7":
      print("\n Symbot Disconnect Check")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'connection lost\|tcpconnection state\|lost_communication'"
      os.system(host4+num1+host5+host6)

    if ans=="8":
      print("\n CHD Bot Check Symbot")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always "
      os.system(host4+num1+host5+host6)
      #Checks for disconnects in ION logs

    if ans=="9":
      print("\n User Defined ION Log Grep")
      print("\n What date are you searching on?")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      grp1 = raw_input("What are you grepping for?: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always '"
      host7 = "'"
      os.system(host4+num1+host5+host6+grp1+host7)

    if ans=="10":
      print("Returns All Symbot Information")
      dte1 = raw_input("Date: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always 'simba\|ECODE\|STUCK\|CH_RECOVERY_FAILURE\|DR_NETWORK_ERROR\|DRIVE_FAULT\|TRAJECTORY\|GENERIC_ALARM\|BOT STUCK DETECTED\|TRAJECTORY STALLED\|ESTIMATION ERROR\|ESTIMATION_ERROR\|state\|ALARM\|ENTERING ALARM\|STO\|ESTOP\|EStop\|Invalid\|STALE\|UNDER_VOLTAGE\|fail everything\|codeplate\|ERROR\|BotVelocity\|not compatible\|Error code:\|RECOVER\|STO\|localize\|sync error\|shuffle\|fault\|FAULT\|Fault\|TRANSFER\|plate\|SAS\|is interfering with target pickface with bounds\|mark_suspect\|error_code: 9611\|error_code: 3313\|Drive Protection Status\|Drive Under Voltage\|STATE_ESTIMATE\|target estimate not contained in payload\|CalculatePlaceParameters failed because there is nothing in the payload bay' | grep -v 'ECODE_NO_ERROR\|Invalid Transition\|SetErrorCodeNode\|PLAN_TRAJECTORY\|MoveEnable_Lift\|Set enable success\|successful configuration\|Error code: 0\|DEFAULT\|OffsetMoveLift\|GetIsSTOBySafetyNode\|SR_NOT_STO'"
      os.system(host4+num1+host5+host6)

    if ans=="11":
      print("Returns All Symbot Information for specific hour")
      dte1 = raw_input("Date: ")
      tme1 = raw_input("Hour: ")
      os.chdir('/avatarlogs/ionlogs/'+dte1)
      num1 = raw_input("Bot number: ")
      grp1 = "simba\|ECODE\|STUCK\|CH_RECOVERY_FAILURE\|DR_NETWORK_ERROR\|DRIVE_FAULT\|TRAJECTORY\|GENERIC_ALARM\|BOT STUCK DETECTED\|TRAJECTORY STALLED\|ESTIMATION ERROR\|ESTIMATION_ERROR\|state\|ALARM\|ENTERING ALARM\|STO\|ESTOP\|EStop\|Invalid \|STALE\|UNDER_VOLTAGE\|fail everything\|codeplate\|ERROR\|BotVelocity\|not compatible\|Error code:\|RECOVER\|STO\|localize\|sync error\|shuffle\|fault\|FAULT\|Fault\|TRANSFER\|plate\|SAS\|is interfering with target pickface with bounds\|mark_suspect\|error_code: 9611\|error_code: 3313\|Drive Protection Status\|Drive Under Voltage\|STATE_ESTIMATE\|target estimate not contained in payload\|CalculatePlaceParameters failed because there is nothing in the payload bay' | grep -v 'ECODE_NO_ERROR\|Invalid Transition\|SetErrorCodeNode\|PLAN_TRAJECTORY\|MoveEnable_Lift\|Set enable success\|successful configuration\|Error code: 0\|DEFAULT\|OffsetMoveLift\|GetIsSTOBySafetyNode\|SR_NOT_STO"
      host4 = "IonParser -m ToText -s Console -- bot_"
      host5 = "_*.* |"
      host6 = "grep -C4 -i --color=always '"
      host7 = "'"
      host8 = "|grep -C5 -i --color=always 'T"
      host9 = ":*'"
      os.system(host4+num1+host5+host6+grp1+host7+host8+tme1+host9)

  if ans=="5":
    print("""
      SAM MENU

      (1)SAS-Monitor
      (2)Simple SAS-Monitor""")

    ans=raw_input("Please select an option from the list:")

    if ans=="1":
      mon = "sas-monitor"
      os.system(mon)

    if ans=="2":
      sam="nice -n 15 sas-monitor"
      os.system(sam)

  if ans=="sam":
    mon = "sas-monitor"
    os.system(mon)

  if ans=="SAM":
    mon = "sas-monitor"
    os.system(mon)

  if ans=="S":
    mon = "sas-monitor"
    os.system(mon)

  if ans=="s":
    mon = "sas-monitor"
    os.system(mon)

  if ans=="zone":
    print("""
      ( 1 )  Reload SIMBA to Zone 1
      ( 2 )  Reload SIMBA to Zone 2
      ( 3 )  Reload SIMBA to Zone 3
      ( 4 )  Reload SIMBA to All Levels """)

    ans=raw_input("Please select an option from the list: ")
    if ans=="1":
      print("""Reload SIMBA to Zone 1""")
      ans=raw_input("pasword required:")
      if ans=="Symbotic12#$":
        host1 = "/opt/bottools/reloadSymbotLevel.sh 1"
        host2 = "/opt/bottools/reloadSymbotLevel.sh 2"
        host3 = "/opt/bottools/reloadSymbotLevel.sh 3"
        x = "clear"
        os.system(host1)
        os.system(host2)
        os.system(host3)
        #os.system(x)

    if ans=="2":
      print("""Reload SIMBA to Zone 2""")
      ans=raw_input("pasword required:")
      if ans=="Symbotic12#$":
        host1 = "/opt/bottools/reloadSymbotLevel.sh 4"
        host2 = "/opt/bottools/reloadSymbotLevel.sh 5"
        host3 = "/opt/bottools/reloadSymbotLevel.sh 6"
        x = "clear"
        os.system(host1)
        os.system(host2)
        os.system(host3)
        #os.system(x)

    if ans=="3":
      print("""Reload SIMBA to Zone 3""")
      ans=raw_input("pasword required:")
      if ans=="Symbotic12#$":
        host1 = "/opt/bottools/reloadSymbotLevel.sh 7"
        host2 = "/opt/bottools/reloadSymbotLevel.sh 8"
        host3 = "/opt/bottools/reloadSymbotLevel.sh 9"
        x = "clear"
        os.system(host1)
        os.system(host2)
        os.system(host3)
        #os.system(x)

    if ans=="4":
      print("""Reload Simba to All Levels""")
      ans=raw_input("pasword required:")
      if ans=="Symbotic12#$":
        host1 = "/opt/bottools/reloadSymbotLevel.sh 1"
        host2 = "/opt/bottools/reloadSymbotLevel.sh 2"
        host3 = "/opt/bottools/reloadSymbotLevel.sh 3"
        host4 = "/opt/bottools/reloadSymbotLevel.sh 4"
        host5 = "/opt/bottools/reloadSymbotLevel.sh 5"
        host6 = "/opt/bottools/reloadSymbotLevel.sh 6"
        host7 = "/opt/bottools/reloadSymbotLevel.sh 7"
        host8 = "/opt/bottools/reloadSymbotLevel.sh 8"
        host9 = "/opt/bottools/reloadSymbotLevel.sh 9"
        x = "clear"
        os.system(host1)
        os.system(host2)
        os.system(host3)
        os.system(host4)
        os.system(host5)
        os.system(host6)
        os.system(host7)
        os.system(host8)
        os.system(host9)
        #os.system(x)

  if ans=="x":
    x = "clear"
    os.system(x)