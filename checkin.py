import json
import os
import sys
import urllib.request
from typing import Dict

# Genshin Impact HoYoLAB Check-in API
ACT_ID = "e202102251931481"
SIGN_URL = f"https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id={ACT_ID}"
INFO_URL = f"https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id={ACT_ID}"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)


def get_headers(cookie: str) -> Dict[str, str]:
    return {
        "User-Agent": USER_AGENT,
        "Referer": "https://act.hoyolab.com/",
        "Origin": "https://act.hoyolab.com",
        "Cookie": cookie,
        "Content-Type": "application/json;charset=UTF-8",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
        "x-rpc-app_version": "1.5.0",
        "x-rpc-client_type": "5",
        "x-rpc-language": "vi-vn",
    }


def send_request(url: str, cookie: str, payload: dict = None) -> dict:
    headers = get_headers(cookie)
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if payload else "GET")
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        return {"retcode": -1, "message": str(e)}


def checkin_genshin(cookie: str):
    print("🚀 Bắt đầu điểm danh Genshin Impact...\n")

    # 1. Kiểm tra thông tin điểm danh
    info_res = send_request(INFO_URL, cookie)
    if info_res.get("retcode") == 0:
        data = info_res.get("data", {})
        total_days = data.get("total_sign_day", 0)
        if data.get("is_sign", False):
            print(f"ℹ️ Hôm nay bạn đã điểm danh rồi! (Tổng số ngày tích lũy: {total_days} ngày)")
            return

    # 2. Tiến hành điểm danh
    sign_res = send_request(SIGN_URL, cookie, payload={"act_id": ACT_ID})
    retcode = sign_res.get("retcode")
    msg = sign_res.get("message", "")

    if retcode == 0:
        print("✅ Điểm danh Genshin Impact thành công!")
    elif retcode == -5003:
        print("ℹ️ Hôm nay bạn đã điểm danh rồi!")
    else:
        print(f"❌ Điểm danh thất bại: [{retcode}] {msg}")


def main():
    cookie = os.environ.get("HOYOLAB_COOKIE", "").strip()
    if not cookie:
        print("❌ LỖI: Chưa có HOYOLAB_COOKIE.")
        sys.exit(1)

    checkin_genshin(cookie)
    print("\n🏁 Hoàn tất!")


if __name__ == "__main__":
    main()
