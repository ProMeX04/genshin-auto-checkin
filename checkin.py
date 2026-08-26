import json
import os
import sys
import time
import urllib.parse
import urllib.request
from typing import Dict, List, Optional

# List of supported HoYoverse games
GAMES = [
    {
        "name": "Genshin Impact",
        "act_id": "e202102251931481",
        "sign_url": "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=e202102251931481",
        "info_url": "https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id=e202102251931481",
    },
    {
        "name": "Honkai: Star Rail",
        "act_id": "e202303301540311",
        "sign_url": "https://sg-public-api.hoyolab.com/event/luna/os/sign?act_id=e202303301540311",
        "info_url": "https://sg-public-api.hoyolab.com/event/luna/os/info?act_id=e202303301540311",
    },
    {
        "name": "Zenless Zone Zero",
        "act_id": "e202406031448091",
        "sign_url": "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/sign?act_id=e202406031448091",
        "info_url": "https://sg-act-nap-api.hoyolab.com/event/luna/zzz/os/info?act_id=e202406031448091",
    },
    {
        "name": "Honkai Impact 3rd",
        "act_id": "e202110291205111",
        "sign_url": "https://sg-public-api.hoyolab.com/event/mani/sign?act_id=e202110291205111",
        "info_url": "https://sg-public-api.hoyolab.com/event/mani/info?act_id=e202110291205111",
    },
]

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
        "Accept-Language": "en-US,en;q=0.9",
        "x-rpc-app_version": "1.5.0",
        "x-rpc-client_type": "5",
        "x-rpc-language": "vi-vn",
    }


def send_request(url: str, cookie: str, payload: Optional[dict] = None) -> dict:
    headers = get_headers(cookie)
    data = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method="POST" if payload else "GET")
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)
    except urllib.error.HTTPError as e:
        return {"retcode": e.code, "message": f"HTTP Error: {e.reason}"}
    except Exception as e:
        return {"retcode": -1, "message": f"Connection Error: {str(e)}"}


def checkin_game(game: dict, cookie: str) -> str:
    name = game["name"]
    act_id = game["act_id"]
    sign_url = game["sign_url"]
    info_url = game["info_url"]

    # Check info first
    info_res = send_request(info_url, cookie)
    if info_res.get("retcode") != 0:
        msg = info_res.get("message", "Lỗi không xác định")
        return f"[{name}] ⚠️ Lỗi kiểm tra trạng thái: {msg} (retcode: {info_res.get('retcode')})"

    data = info_res.get("data", {})
    is_sign = data.get("is_sign", False)
    total_sign_day = data.get("total_sign_day", 0)

    if is_sign:
        return f"[{name}] ℹ️ Hôm nay bạn đã điểm danh rồi (Tổng số ngày: {total_sign_day})."

    # Proceed to sign in
    sign_res = send_request(sign_url, cookie, payload={"act_id": act_id})
    retcode = sign_res.get("retcode")
    msg = sign_res.get("message", "")

    if retcode == 0:
        return f"[{name}] ✅ Điểm danh thành công! (Tổng ngày: {total_sign_day + 1})"
    elif retcode == -5003:
        return f"[{name}] ℹ️ Hôm nay bạn đã điểm danh rồi."
    else:
        return f"[{name}] ❌ Thất bại: {msg} (Code: {retcode})"


def send_discord_notification(webhook_url: str, message: str):
    if not webhook_url:
        return
    payload = {"content": f"**HoYoLAB Auto Check-in Result**\n\n{message}"}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=10)
        print("📨 Đã gửi thông báo đến Discord!")
    except Exception as e:
        print(f"⚠️ Gửi thông báo Discord thất bại: {e}")


def send_telegram_notification(token: str, chat_id: str, message: str):
    if not token or not chat_id:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": f"🎮 *HoYoLAB Auto Check-in*\n\n{message}",
        "parse_mode": "Markdown",
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(req, timeout=10)
        print("📨 Đã gửi thông báo đến Telegram!")
    except Exception as e:
        print(f"⚠️ Gửi thông báo Telegram thất bại: {e}")


def main():
    cookie = os.environ.get("HOYOLAB_COOKIE", "").strip()
    if not cookie:
        print("❌ LỖI: Chưa cấu hình biến môi trường HOYOLAB_COOKIE.")
        print("Vui lòng thêm HOYOLAB_COOKIE vào mục Settings -> Secrets and variables -> Actions trên GitHub.")
        sys.exit(1)

    print("🚀 Bắt đầu quá trình điểm danh HoYoLAB...\n")
    results: List[str] = []

    for game in GAMES:
        res = checkin_game(game, cookie)
        print(res)
        results.append(res)
        time.sleep(2)  # delay nhỏ để tránh rate-limit

    summary = "\n".join(results)

    # Optional notifications
    discord_webhook = os.environ.get("DISCORD_WEBHOOK", "").strip()
    if discord_webhook:
        send_discord_notification(discord_webhook, summary)

    telegram_token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    telegram_chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if telegram_token and telegram_chat_id:
        send_telegram_notification(telegram_token, telegram_chat_id, summary)

    print("\n🏁 Hoàn tất điểm danh!")


if __name__ == "__main__":
    main()
