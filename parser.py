from bs4 import BeautifulSoup
import requests
import json
import time

def getUrlContents(url):
    r = requests.get(url)
    return r.text

def getGpsLocation(address):
    url = f"https://eu1.locationiq.com/v1/search.php?key=e0819caee4d773&q={address}&format=json"
    r = requests.get(url)
    data = json.loads(r.text)
    location = data[0]
    return {"lat": location["lat"], "lng": location["lon"]}

url = 'https://asiointi.kela.fi/opiskelijaravintolahaku/OpruokaApplication?karttalinkki=suo08000091'
parsed_html = BeautifulSoup(getUrlContents(url), "lxml")
urls = [a["href"] for a in parsed_html.find_all("a")][1:]

restaurants = []

for url in urls:
    restaurant = {}
    parsed_html = BeautifulSoup(getUrlContents("https://asiointi.kela.fi/opiskelijaravintolahaku/" + url), "lxml")
    restaurant_info = parsed_html.find_all("td")
    restaurant["title"] = restaurant_info[2].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
    restaurant["location"] = restaurant_info[5].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip() + ", " + restaurant_info[8].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip() + " " + restaurant_info[11].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
    restaurant["website"] = restaurant_info[14].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
    restaurant["location"] = getGpsLocation(restaurant["location"].replace(" ", "+"))
    restaurants.append(restaurant)
    time.sleep(1)

print(restaurants)

with open('data2.json', 'w') as outfile:
    json.dump(restaurants, outfile) 