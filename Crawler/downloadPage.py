import urllib.request

url = "http://learn.leighcotnoir.com/artspeak/elements-color/primary-colors/"

response = urllib.request.urlopen(url)

with open("pcolors.html", "w+") as file:
    file.write(str(response.read()))

