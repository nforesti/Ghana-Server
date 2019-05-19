#!/usr/bin/env python

# PYTHON3

import time
import json
import pyudev
import os
import pwd
import shutil
import tkinter as tk
from tkinter import messagebox

root = tk.Tk()
root.withdraw()

tmp = False

def checkDrive():
  # Give time for drive to mount
  time.sleep(5)

  # Iterates through all flash drives
  try:
    for dir in os.listdir("/media/"):
      if dir != "usb":
        # Checks for presence of files.json
        print("CHECKING:", dir)

        src = "/media/" + dir
        print(os.listdir(src))

        if "files.json" in os.listdir(src):
          print()
          for f in os.listdir(src):
            if f == "files.json":
              with open(f) as filesUSB:
                data = json.load(filesUSB)
              with open(dest + "/files.json", 'r+') as sysFiles:
                data.update(json.load(sysFiles))
                json.dump(data, sysFiles)
            if f != "System Volume Information":
              # Perform more checking + combine json files
              shutil.copy2(src + "/" +  f, dest)

          messagebox.showwarning('', 'File transfers done!')
          return
    messagebox.showwarning('', "No content detected")
  except:
    messagebox.showwarning('', "Error Occured - No content detected")


# https://www.linuxuprising.com/2019/04/automatically-mount-usb-drives-on.html

context = pyudev.Context()
monitor = pyudev.Monitor.from_netlink(context)
monitor.filter_by(subsystem='usb')

dest = os.path.expanduser("~") + '/Desktop/testFiles'

for device in iter(monitor.poll, None):
  if device.action == 'add':
    tmp = not tmp
    
    if tmp:
      print('{} connected'.format(device))

      print(os.listdir("/media/"))

      checkDrive()
