from base64 import b64decode
from base64 import b64encode
import requests

original_cookie = b64decode("QVJtQkxzNjZFOFFLT2FWblZBTUxjODl5emxNTDRpS1VrMDczY0ZPbERBaTNHSmh6dEM2WWJIcFdJNjNYZ3pBdkNSMVQvRytyYlJsNEN4N3lVMm9EckcyYmtlaUZtMmo4VjBDVU9Tdmo2WDdMeVdhNXBXaXN1R3AxNWs5elB2clo=")
original_cookie = bytearray(original_cookie)

def bitFlip(cookie_char_pos:int, bit_pos:int) -> str:
    altered_cookie = bytearray(original_cookie)

    flipped = altered_cookie[cookie_char_pos]^bit_pos

    altered_cookie[cookie_char_pos] = flipped

    altered_cookie_b64 = b64encode(bytes(altered_cookie))

    return altered_cookie_b64.decode("utf-8")

for cookie_char_pos in range(len(original_cookie)):
    print(f"Checking cookie position: {cookie_char_pos} ")
    for bit_pos in range(128): # [1,2,4,8,16,32,64,128]: #byte stream — 8 bit range affords 128 possiblities
        print(bit_pos)
        altered_cookie = bitFlip(cookie_char_pos, bit_pos)
        cookies = {"auth_name": altered_cookie}
        r = requests.get("http://mercury.picoctf.net:56136/", cookies=cookies)
        t = r.text.lower()
        # print(t)
        if "picoCTF{".lower() in t or "picoCTF {".lower() in t:
            print(r.text)
            break
    
