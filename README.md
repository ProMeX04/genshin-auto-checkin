# 🌟 Genshin Impact Auto-Pilot (Google Apps Script)

> Hệ thống tự động **Điểm danh HoYoLAB**, **Săn & Nhập Giftcode**, và **Quét Web Event** Genshin Impact chạy 24/7 hoàn toàn miễn phí trên nền tảng đám mây của Google (**Google Apps Script**).

---

## ✨ Tính năng nổi bật
* ⏰ **Tự động Điểm danh**: Nhận đủ mốc thưởng Nguyên Thạch, Mora hàng ngày từ HoYoLAB.
* 🎁 **Tự động Nhập Giftcode**: Tự quét mã code mới từ máy chủ cộng đồng và nạp thẳng vào hòm thư game.
* 🌐 **Thông báo Sự Kiện Web**: Quét sự kiện web tặng Nguyên Thạch và gửi email kèm link chơi trực tiếp.
* 👥 **Hỗ trợ Đa Tài Khoản**: Chạy cùng lúc nhiều tài khoản (Acc chính, Acc phụ) trong 1 lần kích hoạt.
* ☁️ **Không cần treo máy**: Chạy ngầm trên máy chủ Google, không tốn pin điện thoại hay tài nguyên máy tính.

---

## 📖 Hướng dẫn cài đặt chi tiết (Chỉ mất 3 phút)

### 👉 Bước 1: Tạo dự án trên Google Apps Script
1. Truy cập vào trang quản lý: [https://script.google.com/](https://script.google.com/)
2. Đăng nhập bằng tài khoản Gmail của bạn.
3. Nhấn vào nút **`+ Dự án mới`** (New project) ở góc trên bên trái.
4. Mở file [**`Genshin_Auto_Checkin_Template.js`**](Genshin_Auto_Checkin_Template.js) trong kho này, **copy toàn bộ nội dung code** và dán đè vào khung soạn thảo trên Google Apps Script (xóa hết code mẫu ban đầu).

---

### 👉 Bước 2: Lấy Cookie tài khoản HoYoLAB
1. Mở trình duyệt máy tính (Chrome, Edge, Cốc Cốc...), truy cập trang điểm danh:  
   👉 [https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481](https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481)
2. Đăng nhập vào tài khoản Genshin Impact của bạn.
3. Nhấn phím **`F12`** trên bàn phím (hoặc click chuột phải -> chọn **Inspect / Kiểm tra**).
4. Chọn tab **Application** (Ứng dụng) -> Mục **Cookies** ở cột bên trái -> bấm chọn `https://act.hoyolab.com`.
5. Tìm và copy giá trị của 2 dòng:
   * **`ltuid_v2`**
   * **`ltoken_v2`**
6. Ghép thành một chuỗi dạng:  
   ```text
   ltuid_v2=GIÁ_TRỊ_LTUID; ltoken_v2=GIÁ_TRỊ_LTOKEN;
   ```

---

### 👉 Bước 3: Điền cấu hình vào Script
Trong trình soạn thảo Google Apps Script, tìm đến hàm **`caiDatBanDau()`** ở phần đầu:

```javascript
function caiDatBanDau() {
  // 1. Điền email của bạn để nhận thông báo
  const EMAIL_CUA_BAN = "email_cua_ban@gmail.com";

  // 2. Điền UID và chuỗi Cookie lấy ở Bước 2
  const DANH_SACH_TAI_KHOAN = [
    {
      name: "Tài Khoản Chính",
      uid: "888888888", // Thay bằng UID trong game của bạn
      region: "os_asia", // os_asia (Châu Á), os_usa (Mỹ), os_euro (Châu Âu)
      cookie: "ltuid_v2=...; ltoken_v2=...;" // Dán chuỗi cookie vào đây
    }
  ];

  DB.setAccounts(DANH_SACH_TAI_KHOAN);
  DB.setEmail(EMAIL_CUA_BAN);
}
```

* Nhấn **`Ctrl + S`** (hoặc icon đĩa mềm) để Lưu file.

---

### 👉 Bước 4: Chạy thử nghiệm & Cấp quyền
1. Ở thanh menu trên cùng, bấm vào ô chọn hàm -> chọn **`caiDatBanDau`** -> bấm nút **Chạy** (Run).
   * *Nếu Google hiện hộp thoại yêu cầu cấp quyền*: Bấm **Xem lại quyền** -> Chọn tài khoản Gmail của bạn -> Bấm **Nâng cao (Advanced)** -> Bấm **Đi tới Dự án không an toàn** -> Bấm **Cho phép (Allow)**.
2. Sau khi chạy xong, tiếp tục chọn hàm **`mainDailyGenshin`** -> bấm **Chạy** (Run).
3. Xem bảng điều khiển (Execution Log) bên dưới báo: `✅ Điểm danh THÀNH CÔNG!` là xong.

---

### 👉 Bước 5: Cài đặt giờ tự động chạy mỗi ngày (Trigger)
1. Ở cột menu màu đen ngoài cùng bên trái, bấm vào biểu tượng **Chiếc Đồng Hồ** (Bộ kích hoạt / Triggers).
2. Nhấn nút **`+ Thêm bộ kích hoạt`** (+ Add Trigger) ở góc dưới cùng bên phải.
3. Thiết lập như sau:
   * **Chọn hàm sẽ chạy**: `mainDailyGenshin`
   * **Chọn nguồn sự kiện**: `Theo thời gian` (Time-driven)
   * **Chọn loại trình kích hoạt theo thời gian**: `Bộ đếm ngày` (Day timer)
   * **Chọn thời gian trong ngày**: `6 giờ sáng đến 7 giờ sáng` (hoặc khung giờ tùy thích).
4. Nhấn **Lưu** (Save).

---

🎉 **Hoàn tất!** Từ bây giờ, cứ mỗi sáng thức dậy, máy chủ Google sẽ tự động điểm danh, săn code và nạp quà vào tài khoản Genshin Impact của bạn!
