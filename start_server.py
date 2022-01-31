#!/usr/bin/python3
import os
import platform

if platform.system() == "Linux" or platform.system() == "Darwin":
    choice = input("Execute with 'python3'? (Y/N): ")
    if choice == "Y" or choice == "y":
        command = "python3 -m http.server 8000"
    else:
        command = "python -m SimpleHTTPServer 8000"
else:
    # Windows
    command = "python -m http.server 8000"

print("--------------------------------------------------")
print("Open Google Chrome and go to http://localhost:8000")
print("--------------------------------------------------")
os.system(command)
