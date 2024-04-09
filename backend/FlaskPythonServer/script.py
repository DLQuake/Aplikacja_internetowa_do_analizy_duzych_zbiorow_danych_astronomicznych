import sys

args = sys.argv[1:]

if len(args) > 0:
    print("Argumenty przekazane z kontrolera Express:")
    for arg in args:
        print(arg)
else:
    print("Brak argumentów przekazanych z kontrolera Express")
