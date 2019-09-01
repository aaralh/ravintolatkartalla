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
    with open('restaurants.json', 'w') as outfile:
        json.dump(restaurants, outfile)

def getRestaurants():
    restaurants = []
    areaUrls = getAreaUrls()
    for areaUrl in areaUrls:
        cityUrls = getCityUrlsForArea(areaUrl)
        for cityUrl in cityUrls:
            restaurants = restaurants + getRestaurantsForCity(cityUrl)

    saveRestaurantsToFile(restaurants)

def getLunchListsForRestaurants():
    with open('dataAll.json', 'r') as json_file:
        restaurants = json.load(json_file)

    for index in range(len(restaurants)):
        if ("UNICAFE" in restaurants[index]["title"]):
            restaurants[index]["lunchUrl"] = "https://unicafe.fi/wp-json/swiss/v1/restaurants?lang=fi"
            restaurants[index]["type"] = "unicafe"

        elif (restaurants[index]["website"] == ""):
            restaurants[index]["type"] = "other"
            continue
        
        if ("www.fazerfoodco.fi" in restaurants[index]["website"] or "www.amica.fi" in restaurants[index]["website"]):
            parsed_html = BeautifulSoup(getUrlContents(restaurants[index]["website"]), "lxml")
            menuItems = parsed_html.find_all("div", {"class": "menu-action-popup-content-item"})
            if (len(menuItems) < 1):
                continue
            try:
                luch_url = menuItems[2].find("a")["href"]
                restaurants[index]["lunchUrl"] = "https://www.fazerfoodco.fi" + luch_url
            except:
                restaurants[index]["lunchUrl"] = None
                print("No luch url found")

            restaurants[index]["type"] = "fazer"

    saveRestaurantsToFile(restaurants)    

getLunchListsForRestaurants()