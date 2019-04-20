#!/usr/bin/env python3

from os import system, chdir, getcwd, popen
from prompt_toolkit import prompt
from prompt_toolkit.history import FileHistory
from prompt_toolkit.auto_suggest import AutoSuggestFromHistory


chdir(getcwd() + '/bash_scripts')

commands = {
    1:"./run.sh",
    2:"docker ps", 
    3:"./restart_bot.sh",
    4:"./restart_api.sh",
    5:"./restart_front.sh",
    6:"docker rm -f redis;docker run --name redis -d -p 6379:6379 --network=pureButton neojt/mredis",
    7:"docker rm -f bot redis front api; ./run.sh", 
    8:"docker rm -f bot redis front api"
}

while True:
  try:
      print('''
      1. Run\n
      2. Docker ps\n
      3. Restart bot container\n
      4. Restart api container\n
      5. Restart frontend container\n
      6. Restart redis\n 
      7. Restart all\n
      8. Rm all containers\n
      9. Exit\n
      Command:
      logs name_of_container(logs api/front/bot/redis)
      ''')

      user_input = prompt('==>', history=FileHistory('history.txt'), auto_suggest=AutoSuggestFromHistory(),)
      
      check = user_input.split(" ")
      
      if check[0] == "logs":
        system('clear')
        _, columns = popen('stty size', 'r').read().split()
        
        print(f'logs of {check[1]} container')
        print("-" * int(columns))
        system(f'docker logs {check[1]}')
        print("-" * int(columns))
        print("\n")
        continue

      if int(user_input) == 9:
        print("\nExit...")
        break
      else:
        system('clear')
        _, columns = popen('stty size', 'r').read().split()
        print("-" * int(columns))
        system(commands[int(user_input)])
        print("-" * int(columns))

  except KeyboardInterrupt:
        print("\nExit...")
        break
  except ValueError:
        print("Unknown command")

  except KeyError:
        print("Unknown command")

  except EOFError as error:
        print("\nExit...")
        break
