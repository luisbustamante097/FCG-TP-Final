#!/usr/bin/python3
import os
import platform

if platform.system() == "Linux" or platform.system() == "Darwin":
    choice = input("Execute with 'python3'? (Y/N): ")
    if choice == "Y" or choice == "y":
        pythonString = "python3"
    else:
        pythonString = "python"
    
    # Mac, Linux
    command = pythonString + " -m SimpleHTTPServer 8000"
else:
    # Windows
    command = "python -m http.server 8000"

print("--------------------------------------------------")
print("Open Google Chrome and go to http://localhost:8000")
print("--------------------------------------------------")
os.system(command)
