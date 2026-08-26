# 🎮 HoYoLAB Auto Daily Check-in (Genshin, HSR, ZZZ, HI3)

Tool tự động điểm danh hàng ngày các tựa game HoYoverse (**Genshin Impact**, **Honkai: Star Rail**, **Zenless Zone Zero**, **Honkai Impact 3rd**) chạy hoàn toàn miễn phí trên đám mây qua **GitHub Actions**.

---

## 🚀 Hướng dẫn kích hoạt

### Bước 1: Lấy Cookie HoYoLAB
1. Truy cập [Trang sự kiện điểm danh HoYoLAB](https://act.hoyolab.com/ys/event/e202102251931481/index.html) trên trình duyệt và đăng nhập tài khoản.
2. Nhấn `F12` (hoặc chuột phải -> **Inspect**) -> chuyển sang tab **Console**.
3. Dán dòng sau rồi nhấn `Enter`:
   ```javascript
   document.cookie
   ```
4. Copy toàn bộ chuỗi kết quả (chuỗi chứa `ltoken_v2`, `ltuid_v2` hoặc `account_id_v2`, `cookie_token_v2`).

---

### Bước 2: Thêm Secret vào GitHub Repository
1. Trên repository này, chọn **Settings** -> **Secrets and variables** -> **Actions**.
2. Nhấn **New repository secret**:
   - **Name**: `HOYOLAB_COOKIE`
   - **Secret**: Dán chuỗi cookie vừa copy ở Bước 1.
   - Nhấn **Add secret**.

*(Tùy chọn) Nếu muốn nhận thông báo:*
- `DISCORD_WEBHOOK`: Webhook URL kênh Discord của bạn.
- `TELEGRAM_BOT_TOKEN`: Token của Telegram Bot (`BotFather`).
- `TELEGRAM_CHAT_ID`: Chat ID nhận tin nhắn.

---

### Bước 3: Chạy thử nghiệm
1. Vào tab **Actions** trên GitHub.
2. Chọn workflow **HoYoLAB Daily Check-in**.
3. Nhấn **Run workflow** -> **Run workflow** để kiểm tra ngay lập tức.
4. Mặc định hệ thống sẽ tự động chạy vào lúc **07:00 sáng (Giờ Việt Nam)** mỗi ngày.

---

## 🔒 Lưu ý an toàn & bảo mật
- Giữ Repository ở chế độ **Private**.
- Tuyệt đối không chia sẻ `HOYOLAB_COOKIE` cho bất kỳ ai.
- Cookie thường duy trì được vài tháng trừ khi bạn bấm đăng xuất tài khoản trên trình duyệt.
