from bs4 import BeautifulSoup
import requests
import json
import time

def getUrlContents(url):
    r = requests.get(url)
    return r.text

def getGpsLocation(address):
    print(address)
    url = f"https://eu1.locationiq.com/v1/search.php?key=e0819caee4d773&q={address}&format=json"
    r = requests.get(url)
    data = json.loads(r.text)
    print(data)
    if(isinstance(data, list) == False):
        return None
    location = data[0]
    return {"lat": location["lat"], "lng": location["lon"]}

def getRestaurantsForCity(url):
    restaurants = []
    parsed_html = BeautifulSoup(getUrlContents(url), "lxml")
    urls = [a["href"] for a in parsed_html.find_all("a")][1:]

    if (len(urls) < 1):
        return restaurants

    for url in urls:
        restaurant = {}
        parsed_html = BeautifulSoup(getUrlContents("https://asiointi.kela.fi/opiskelijaravintolahaku/" + url), "lxml")
        restaurant_info = parsed_html.find_all("td")
        restaurant["title"] = restaurant_info[2].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
        restaurant["address"] = restaurant_info[5].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip() + ", " + restaurant_info[8].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip() + " " + restaurant_info[11].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
        restaurant["website"] = restaurant_info[14].text.replace('\n', ' ').replace('\r', '').replace('\t', '').strip()
        restaurant["location"] = getGpsLocation(restaurant["address"].replace(" ", "+"))
        restaurants.append(restaurant)
        time.sleep(1)

    return restaurants

def getCityUrlsForArea(url):
    url = f'https://kela.fi/{url}'
    parsed_html = BeautifulSoup(getUrlContents(url), "lxml")
    return [a["href"] for a in parsed_html.find("section", {"class": "kelafi-article"}).find("ul").find_all("a")]


def getAreaUrls():
    url = 'https://www.kela.fi/ateriatuki-opiskelijaravintolahaku'
    parsed_html = BeautifulSoup(getUrlContents(url), "lxml")
    return [a["href"] for a in parsed_html.find("section", {"class": "kelafi-article"}).find("ul").find_all("a")]


def saveRestaurantsToFile(restaurants):
    with open('dataAll.json', 'w') as outfile:
        json.dump(restaurants, outfile)

restaurants = []
areaUrls = getAreaUrls()
print(areaUrls)
for areaUrl in areaUrls:
    cityUrls = getCityUrlsForArea(areaUrl)
    print(cityUrls)
    for cityUrl in cityUrls:
        print(cityUrl)
        restaurants = restaurants + getRestaurantsForCity(cityUrl)

saveRestaurantsToFile(restaurants)