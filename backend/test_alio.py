import requests
import json
import urllib.parse

def test_api():
    # usually needs URL decoding if it's already encoded, but we can try pass it as is
    key = 'fe052bafcd318c77644c0fd6a84e1548b84a71724496d60f76d7d252104c2bec' 
    url = f"https://apis.data.go.kr/1051000/recruitment/list?serviceKey={key}&numOfRows=5&pageNo=1&resultType=json"
    
    try:
        res = requests.get(url, verify=False)
        print("Status code:", res.status_code)
        print("Text:", res.text[:500])
    except Exception as e:
        print("Error:", e)

    # Let's also try decoded version if it fails or requires it
test_api()
