import ssl
import urllib.request
from urllib.error import URLError, HTTPError

def test_api():
    key = 'fe052bafcd318c77644c0fd6a84e1548b84a71724496d60f76d7d252104c2bec'
    # Try decoding just in case
    import urllib.parse
    decoded_key = urllib.parse.unquote(key)
    
    url = f"https://apis.data.go.kr/1051000/recruitment/list?serviceKey={key}&numOfRows=5&pageNo=1&resultType=json"
    
    context = ssl._create_unverified_context()
    try:
        req = urllib.request.Request(url)
        response = urllib.request.urlopen(req, context=context)
        html = response.read()
        print("Response:", html.decode('utf-8')[:500])
    except HTTPError as e:
        print("HTTP Error:", e.code, e.reason)
        print("Body:", e.read().decode('utf-8'))
    except URLError as e:
        print("URL Error:", e.reason)
    except Exception as e:
        print("Exception:", str(e))

if __name__ == '__main__':
    test_api()
