/**
 * ======================================================================================
 * 🌟 GENSHIN IMPACT AUTO-PILOT CLOUD (GOOGLE APPS SCRIPT)
 * 🌟 HỆ THỐNG TỰ ĐỘNG ĐIỂM DANH & NHẬP GIFTCODE GENSHIN IMPACT ĐA TÀI KHOẢN MIỄN PHÍ 100%
 * ======================================================================================
 * 
 * 📌 TÍNH NĂNG CHÍNH:
 *  1. ⏰ Tự động Điểm danh HoYoLAB mỗi ngày trên máy chủ Google (Không cần bật máy tính hay điện thoại).
 *  2. 🎁 Tự động săn & nhập Giftcode mới nhất (Nguyên Thạch, Mora, Sách EXP) vào thẳng hòm thư game.
 *  3. 🌐 Tự động quét Sự Kiện Web (Web Event) có thưởng Nguyên Thạch và gửi link trực tiếp về Gmail.
 *  4. 👥 Hỗ trợ ĐA TÀI KHOẢN (Chạy 1 lúc 2, 3 hoặc nhiều nick không giới hạn).
 *  5. 💾 Cơ sở dữ liệu thông minh: Chống spam API, nhớ lịch sử điểm danh, bảo vệ tài khoản an toàn 100%.
 * 
 * --------------------------------------------------------------------------------------
 * 📖 HƯỚNG DẪN SỬ DỤNG TỪ A - Z DÀNH CHO NGƯỜI MỚI (MẤT 3 PHÚT SETUP)
 * --------------------------------------------------------------------------------------
 * 
 * 👉 BƯỚC 1: TẠO DỰ ÁN GOOGLE APPS SCRIPT
 *   1. Mở trình duyệt web, truy cập: https://script.google.com/
 *   2. Đăng nhập tài khoản Google (Gmail) của bạn.
 *   3. Bấm vào nút "+ Dự án mới" (New project) ở góc trên bên trái.
 *   4. Xóa hết code mặc định trong file `Code.gs`, copy toàn bộ nội dung file này dán vào.
 * 
 * 👉 BƯỚC 2: CÁCH LẤY COOKIE HOYOLAB (CỰC KỲ DỄ)
 *   1. Mở trình duyệt trên máy tính (Chrome, Edge, Cốc Cốc, Brave...).
 *   2. Truy cập trang điểm danh: https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481
 *   3. Đăng nhập vào tài khoản Genshin Impact của bạn.
 *   4. Nhấn phím F12 trên bàn phím (hoặc chuột phải chọn "Kiểm tra / Inspect").
 *   5. Chuyển sang tab "Application" (Ứng dụng / Bộ nhớ) -> mục bên trái chọn "Cookies" -> chọn "https://act.hoyolab.com"
 *   6. Nhìn vào bảng Cookie, tìm và copy giá trị của 2 khóa quan trọng nhất:
 *      - `ltoken_v2`
 *      - `ltuid_v2`
 *      (Hoặc copy toàn bộ dòng Cookie nếu bạn biết cách).
 *      Ghép lại thành chuỗi dạng: "ltuid_v2=...; ltoken_v2=...;"
 *   7. Điền Cookie và UID của bạn vào hàm `caiDatBanDau()` ở DÒNG 80 bên dưới.
 * 
 * 👉 BƯỚC 3: NẠP DỮ LIỆU & KIỂM TRA
 *   1. Nhấn Ctrl + S (hoặc Cmd + S trên Mac) để Lưu script.
 *   2. Ở thanh menu trên cùng, chọn hàm: `caiDatBanDau` -> Bấm nút "Chạy" (Run).
 *      (Nếu Google hiện thông báo cấp quyền, hãy bấm "Xem lại quyền" -> Chọn tài khoản Google của bạn -> Bấm "Nâng cao" -> Bấm "Đi tới Dự án không an toàn" -> Bấm "Cho phép").
 *   3. Sau đó chọn hàm: `mainDailyGenshin` -> Bấm "Chạy" (Run) để thử nghiệm điểm danh ngay lập tức!
 * 
 * 👉 BƯỚC 4: CÀI ĐẶT TỰ ĐỘNG CHẠY HÀNG NGÀY (TRIGGER)
 *   1. Ở menu cột bên trái của Google Apps Script, bấm vào biểu tượng "Đồng hồ" (Bộ kích hoạt / Triggers).
 *   2. Bấm nút "+ Thêm bộ kích hoạt" (+ Add Trigger) ở góc dưới cùng bên phải.
 *   3. Cài đặt các thông số như sau:
 *      - Chọn hàm sẽ chạy: `mainDailyGenshin`
 *      - Nguồn sự kiện: `Theo thời gian` (Time-driven)
 *      - Loại trình kích hoạt: `Bộ đếm ngày` (Day timer)
 *      - Chọn thời gian trong ngày: `6 giờ sáng đến 7 giờ sáng` (hoặc giờ bạn thích).
 *   4. Bấm "Lưu" (Save). 
 *   🎉 CHÚC MỪNG BẠN! Từ nay Google sẽ tự động điểm danh và nhận giftcode cho bạn mỗi ngày!
 * ======================================================================================
 */

// ======================================================================================
// ⚙️ KHU VỰC CẤU HÌNH TÀI KHOẢN (BẠN CHỈ CẦN CHỈNH SỬA Ở MỤC NÀY)
// ======================================================================================

function caiDatBanDau() {
  // 1. Điền Gmail nhận thông báo Web Event & Cảnh báo khi cookie hết hạn
  const EMAIL_CUA_BAN = "dien_email_cua_ban@gmail.com";

  // 2. Danh sách tài khoản cần tự động chạy (Có thể thêm 1, 2 hoặc nhiều nick tùy thích)
  const DANH_SACH_TAI_KHOAN = [
    // --- TÀI KHOẢN 1 ---
    {
      name: "Tài Khoản Chính",
      uid: "DIEN_UID_ACC_1_VAO_DAY",        // Ví dụ: "885123456"
      region: "os_asia",                     // "os_asia" (Châu Á), "os_usa" (Bắc Mỹ), "os_euro" (Châu Âu), "os_cht" (Đài Loan/HK/MO)
      cookie: "DAN_CHUOI_COOKIE_ACC_1_VAO_DAY"
    },

    // --- TÀI KHOẢN 2 (Nếu không dùng tài khoản 2, bạn có thể xóa cả đoạn này đi) ---
    {
      name: "Tài Khoản Phụ",
      uid: "DIEN_UID_ACC_2_VAO_DAY",
      region: "os_asia",
      cookie: "DAN_CHUOI_COOKIE_ACC_2_VAO_DAY"
    }
  ];

  // Lưu vào Database bảo mật của Google (Không bị lộ ra ngoài)
  DB.setAccounts(DANH_SACH_TAI_KHOAN);
  DB.setEmail(EMAIL_CUA_BAN);

  Logger.log("🎉 ========================================================");
  Logger.log(`✅ ĐÃ LƯU THÀNH CÔNG ${DANH_SACH_TAI_KHOAN.length} TÀI KHOẢN VÀO CƠ SỞ DỮ LIỆU!`);
  Logger.log(`📧 Email nhận thông báo: ${EMAIL_CUA_BAN}`);
  Logger.log("👉 Bây giờ bạn hãy chọn hàm 'mainDailyGenshin' và bấm Chạy thử nhé!");
  Logger.log("==========================================================");
}

// ======================================================================================
// 💾 HỆ THỐNG CƠ SỞ DỮ LIỆU (PROPERTIES SERVICE DATABASE)
// ======================================================================================
const DB = {
  getAccounts() {
    const raw = PropertiesService.getScriptProperties().getProperty("ACCOUNTS_LIST");
    return raw ? JSON.parse(raw) : [];
  },
  setAccounts(accountsList) {
    PropertiesService.getScriptProperties().setProperty("ACCOUNTS_LIST", JSON.stringify(accountsList));
  },
  getEmail() {
    return PropertiesService.getScriptProperties().getProperty("ALERT_EMAIL") || "";
  },
  setEmail(emailStr) {
    PropertiesService.getScriptProperties().setProperty("ALERT_EMAIL", emailStr.trim());
  },
  getLastCheckin(uid) {
    return {
      date: PropertiesService.getScriptProperties().getProperty(`LAST_CHECKIN_DATE_${uid}`) || "Chưa có",
      time: PropertiesService.getScriptProperties().getProperty(`LAST_CHECKIN_TIME_${uid}`) || "Chưa có",
      totalDays: PropertiesService.getScriptProperties().getProperty(`TOTAL_SIGN_DAYS_${uid}`) || "0"
    };
  },
  setLastCheckin(uid, dateStr, timeStr, totalDays) {
    PropertiesService.getScriptProperties().setProperty(`LAST_CHECKIN_DATE_${uid}`, dateStr);
    PropertiesService.getScriptProperties().setProperty(`LAST_CHECKIN_TIME_${uid}`, timeStr);
    if (totalDays !== undefined && totalDays !== null) {
      PropertiesService.getScriptProperties().setProperty(`TOTAL_SIGN_DAYS_${uid}`, totalDays.toString());
    }
  },
  getSavedCodes(uid) {
    const raw = PropertiesService.getScriptProperties().getProperty(`SAVED_CODES_${uid}`);
    return raw ? JSON.parse(raw) : [];
  },
  saveCode(uid, code) {
    const codes = this.getSavedCodes(uid);
    if (!codes.includes(code)) {
      codes.push(code);
      PropertiesService.getScriptProperties().setProperty(`SAVED_CODES_${uid}`, JSON.stringify(codes));
    }
  },
  resetAll() {
    PropertiesService.getScriptProperties().deleteAllProperties();
    Logger.log("🗑️ Đã xóa sạch toàn bộ Cơ sở dữ liệu!");
  }
};

// ======================================================================================
// 🚀 HÀM ĐIỀU HÀNH CHÍNH HÀNG NGÀY (HÀM ĐƯỢC GỌI TỰ ĐỘNG BỞI TRIGGER)
// ======================================================================================
function mainDailyGenshin() {
  const accounts = DB.getAccounts();
  if (accounts.length === 0) {
    Logger.log("❌ LỖI: Chưa có tài khoản nào trong Cơ sở dữ liệu. Hãy chạy hàm 'caiDatBanDau()' trước!");
    return;
  }

  Logger.log(`🚀 BẮT ĐẦU CHU KỲ TỰ ĐỘNG CHO ${accounts.length} TÀI KHOẢN...`);

  accounts.forEach((acc, index) => {
    Logger.log(`\n==================================================`);
    Logger.log(`👤 [${index + 1}/${accounts.length}] ĐANG XỬ LÝ: ${acc.name} (UID: ${acc.uid})`);
    Logger.log(`==================================================`);

    if (!acc.cookie || acc.cookie.includes("DAN_CHUOI_COOKIE")) {
      Logger.log(`⚠️ Tài khoản ${acc.name} chưa điền Cookie hợp lệ. Bỏ qua!`);
      return;
    }

    // 1. Tự động Điểm danh HoYoLAB
    autoCheckinChoTaiKhoan(acc);
    Utilities.sleep(2000);

    // 2. Tự động Nhập Giftcode
    autoRedeemGiftcodeChoTaiKhoan(acc);

    if (index < accounts.length - 1) {
      Utilities.sleep(3000); // Nghỉ 3s giữa các tài khoản
    }
  });

  // 3. Quét sự kiện Web mới nhận Nguyên Thạch
  kiemTraWebEventMoi();

  Logger.log("\n🏁 HOÀN TẤT CHU KỲ HÀNG NGÀY CHO TOÀN BỘ CÁC TÀI KHOẢN!");
}

// ======================================================================================
// ⏰ TÍNH NĂNG 1: TỰ ĐỘNG ĐIỂM DANH (HOYOLAB DAILY SIGN-IN)
// ======================================================================================
function autoCheckinChoTaiKhoan(acc) {
  Logger.log(`--- 🚀 ĐIỂM DANH: ${acc.name} ---`);

  const today = Utilities.formatDate(new Date(), "GMT+7", "yyyy-MM-dd");
  const nowFormatted = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
  const lastCheckin = DB.getLastCheckin(acc.uid);

  // Kiểm tra Database cache: Nếu hôm nay đã điểm danh rồi thì bỏ qua ngay để tiết kiệm tài nguyên
  if (lastCheckin.date === today) {
    Logger.log(`ℹ️ [Database] Hôm nay (${today}) ĐÃ ĐIỂM DANH lúc ${lastCheckin.time} (Tích lũy: ${lastCheckin.totalDays} ngày). Bỏ qua!`);
    return;
  }

  const actId = "e202102251931481";
  const infoUrl = "https://sg-hk4e-api.hoyolab.com/event/sol/info?act_id=" + actId;
  const signUrl = "https://sg-hk4e-api.hoyolab.com/event/sol/sign?act_id=" + actId;

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Referer": "https://act.hoyolab.com/",
    "Origin": "https://act.hoyolab.com",
    "Cookie": acc.cookie,
    "Content-Type": "application/json;charset=UTF-8"
  };

  try {
    const infoRes = UrlFetchApp.fetch(infoUrl, { method: "get", headers: headers, muteHttpExceptions: true });
    const infoData = JSON.parse(infoRes.getContentText());

    if (infoData.retcode === -100) {
      guiCanhBaoHetHanCookie(acc.name);
      return;
    }

    let totalDays = 0;
    if (infoData.retcode === 0 && infoData.data) {
      totalDays = infoData.data.total_sign_day || 0;
      if (infoData.data.is_sign) {
        Logger.log(`ℹ️ Hôm nay bạn đã điểm danh trước đó rồi (Tổng tích lũy: ${totalDays} ngày).`);
        DB.setLastCheckin(acc.uid, today, nowFormatted, totalDays);
        return;
      }
    }

    const signRes = UrlFetchApp.fetch(signUrl, {
      method: "post",
      headers: headers,
      payload: JSON.stringify({ act_id: actId }),
      muteHttpExceptions: true
    });
    const signData = JSON.parse(signRes.getContentText());

    if (signData.retcode === 0) {
      totalDays += 1;
      Logger.log(`✅ Điểm danh THÀNH CÔNG! (Tổng tích lũy: ${totalDays} ngày)`);
      DB.setLastCheckin(acc.uid, today, nowFormatted, totalDays);
    } else if (signData.retcode === -5003) {
      Logger.log(`ℹ️ Hôm nay bạn đã điểm danh rồi.`);
      DB.setLastCheckin(acc.uid, today, nowFormatted, totalDays);
    } else if (signData.retcode === -100) {
      guiCanhBaoHetHanCookie(acc.name);
    } else {
      Logger.log(`⚠️ Kết quả: [${signData.retcode}] ${signData.message}`);
    }
  } catch (e) {
    Logger.log(`❌ Lỗi kết nối điểm danh (${acc.name}): ${e}`);
  }
}

// ======================================================================================
// 🎁 TÍNH NĂNG 2: TỰ ĐỘNG SĂN VÀ NHẬP GIFTCODE GENSHIN IMPACT
// ======================================================================================
function autoRedeemGiftcodeChoTaiKhoan(acc) {
  Logger.log(`\n--- 🎁 KIỂM TRA GIFTCODE MỚI: ${acc.name} ---`);

  const processedCodes = DB.getSavedCodes(acc.uid);
  Logger.log(`💾 Đã lưu ${processedCodes.length} mã đã xử lý trước đó trong Database.`);

  // 1. Quét danh sách Giftcode trực tiếp từ API cộng đồng
  let onlineCodes = [];
  try {
    const res = UrlFetchApp.fetch("https://hoyo-codes.seria.moe/codes?game=genshin", { muteHttpExceptions: true });
    const json = JSON.parse(res.getContentText());
    if (json.codes && json.codes.length > 0) {
      onlineCodes = json.codes.filter(c => c.status === "OK").map(c => c.code);
    }
  } catch (e) {
    Logger.log("⚠️ Không lấy được danh sách code từ máy chủ trực tuyến.");
    return;
  }

  // 2. Lọc ra những mã MỚI chưa từng xử lý
  const newCodes = onlineCodes.filter(code => !processedCodes.includes(code));

  if (newCodes.length === 0) {
    Logger.log("✨ Không có Giftcode mới nào cần nhập.");
    return;
  }

  Logger.log(`🔥 Phát hiện ${newCodes.length} Giftcode MỚI: ${newCodes.join(", ")}`);

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Referer": "https://genshin.hoyoverse.com/vi/gift",
    "Origin": "https://genshin.hoyoverse.com",
    "Cookie": acc.cookie,
    "Content-Type": "application/json;charset=UTF-8"
  };

  newCodes.forEach((code, index) => {
    const redeemUrl = `https://sg-hk4e-api.hoyoverse.com/common/apicdkey/api/webExchangeCdkey?uid=${acc.uid}&region=${acc.region}&lang=vi&cdkey=${code}&game_biz=hk4e_global`;
    try {
      const res = UrlFetchApp.fetch(redeemUrl, { method: "get", headers: headers, muteHttpExceptions: true });
      const data = JSON.parse(res.getContentText());

      if (data.retcode === 0) {
        Logger.log(`🎉 [${code}]: Đổi quà THÀNH CÔNG! Quà đã gửi vào hòm thư.`);
        DB.saveCode(acc.uid, code);
      } else if (data.retcode === -2017 || data.retcode === -2006) {
        Logger.log(`ℹ️ [${code}]: Mã này đã nhận trước đó -> Lưu vào Database.`);
        DB.saveCode(acc.uid, code);
      } else if (data.retcode === -2001) {
        Logger.log(`⏰ [${code}]: Mã đã hết hạn -> Lưu vào Database.`);
        DB.saveCode(acc.uid, code);
      } else if (data.retcode === -1071) {
        Logger.log(`ℹ️ [${code}]: Phiên đổi quà cần đăng nhập trên web -> Tạm bỏ qua.`);
      } else {
        Logger.log(`⚠️ [${code}]: ${data.message} (${data.retcode})`);
      }
    } catch (err) {
      Logger.log(`❌ Lỗi khi đổi mã [${code}]: ${err}`);
    }

    // Nghỉ 5.5 giây giữa các mã theo quy định chống spam của HoYoverse
    if (index < newCodes.length - 1) {
      Utilities.sleep(5500);
    }
  });
}

// ======================================================================================
// 🌐 TÍNH NĂNG 3: QUÉT SỰ KIỆN TRANG WEB MỚI (WEB EVENTS) & GỬI LINK GMAIL
// ======================================================================================
function kiemTraWebEventMoi() {
  Logger.log("\n--- 🌐 KIỂM TRA SỰ KIỆN TRANG WEB MỚI ---");

  const newsUrl = "https://bbs-api-os.hoyolab.com/community/post/wapi/getNewsList?gids=2&type=2&page_size=10";

  try {
    const res = UrlFetchApp.fetch(newsUrl, { muteHttpExceptions: true });
    const data = JSON.parse(res.getContentText());

    if (data.retcode !== 0 || !data.data || !data.data.list) return;

    const posts = data.data.list;
    const notifiedEvents = PropertiesService.getScriptProperties().getProperty("NOTIFIED_WEB_EVENTS") || "[]";
    const savedEventIds = JSON.parse(notifiedEvents);
    const userEmail = DB.getEmail();

    posts.forEach(item => {
      const post = item.post;
      const title = post.subject || "";
      const postId = post.post_id;

      const isWebEvent = title.toLowerCase().includes("sự kiện trang web") ||
                         title.toLowerCase().includes("web event") ||
                         title.toLowerCase().includes("trang web sự kiện");

      if (isWebEvent && !savedEventIds.includes(postId)) {
        Logger.log(`🔥 PHÁT HIỆN SỰ KIỆN MỚI: ${title}`);

        let directLink = `https://www.hoyolab.com/article/${postId}`;
        try {
          const detailUrl = `https://bbs-api-os.hoyolab.com/community/post/wapi/getPostFull?post_id=${postId}`;
          const detRes = UrlFetchApp.fetch(detailUrl, { muteHttpExceptions: true });
          const detData = JSON.parse(detRes.getContentText());
          const content = detData?.data?.post?.post?.content || "";

          const matches = content.match(/https?:\/\/(?:hoyo\.link|act\.hoyoverse\.com|act\.hoyolab\.com)[^\s"<>]+/gi);
          if (matches && matches.length > 0) {
            directLink = matches[0];
          }
        } catch (err) {}

        if (userEmail) {
          const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; max-width: 600px;">
              <h2 style="color: #2563eb; margin-top: 0;">🎁 Sự Kiện Trang Web Mới - Genshin Impact</h2>
              <p style="font-size: 16px; color: #1e293b;"><strong>${title}</strong></p>
              <p style="color: #64748b;">Hệ thống phát hiện có sự kiện web mới nhận Nguyên Thạch. Hãy bấm nút bên dưới để chơi và nhận quà nhé:</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${directLink}" style="background-color: #ff6f00; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                  👉 BẤM VÀO ĐÂY ĐỂ CHƠI NGAY
                </a>
              </div>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 20px;">Email này được gửi tự động bởi hệ thống Genshin Impact Auto-Pilot của bạn.</p>
            </div>
          `;

          MailApp.sendEmail({
            to: userEmail,
            subject: `🎁 [Genshin Web Event] ${title}`,
            body: `Sự Kiện Web Mới: ${title}\nLink tham gia: ${directLink}`,
            htmlBody: htmlContent
          });
          Logger.log(`📧 Đã gửi email thông báo sự kiện đến: ${userEmail}`);
        }

        savedEventIds.push(postId);
        PropertiesService.getScriptProperties().setProperty("NOTIFIED_WEB_EVENTS", JSON.stringify(savedEventIds));
      }
    });
  } catch (e) {
    Logger.log(`❌ Lỗi khi kiểm tra Web Event: ${e}`);
  }
}

// ======================================================================================
// ⚠️ TÍNH NĂNG 4: CẢNH BÁO TỰ ĐỘNG KHI COOKIE HẾT HẠN QUA EMAIL
// ======================================================================================
function guiCanhBaoHetHanCookie(accName) {
  Logger.log(`❌ Cookie của [${accName}] đã hết hạn hoặc không hợp lệ!`);
  const userEmail = DB.getEmail();
  if (userEmail) {
    MailApp.sendEmail({
      to: userEmail,
      subject: `⚠️ [Genshin Auto Check-in] Cookie của ${accName} đã hết hạn!`,
      body: `Chào bạn,\n\nCookie của tài khoản [${accName}] đã hết hạn hoặc bị đăng xuất.\nVui lòng truy cập https://act.hoyolab.com để lấy lại Cookie mới và cập nhật vào script nhé!`
    });
  }
}

// ======================================================================================
// 📊 HÀM TIỆN ÍCH: XEM THÔNG TIN TRONG DATABASE
// ======================================================================================
function xemThongTinDB() {
  const accounts = DB.getAccounts();
  const email = DB.getEmail();

  Logger.log("📊 ================= CƠ SỞ DỮ LIỆU ĐA TÀI KHOẢN =================");
  Logger.log(`📧 Email nhận thông báo : ${email || "Chưa thiết lập"}`);
  Logger.log(`👥 Tổng số tài khoản    : ${accounts.length}`);

  accounts.forEach((acc, i) => {
    const last = DB.getLastCheckin(acc.uid);
    const codes = DB.getSavedCodes(acc.uid);
    Logger.log(`\n--- [Acc ${i + 1}] ${acc.name} (UID: ${acc.uid}) ---`);
    Logger.log(`📅 Ngày điểm danh gần nhất : ${last.date}`);
    Logger.log(`⏰ Giờ điểm danh gần nhất  : ${last.time}`);
    Logger.log(`🎁 Tổng số ngày tích lũy   : ${last.totalDays} ngày`);
    Logger.log(`💾 Số lượng Giftcode đã lưu: ${codes.length} mã`);
  });
  Logger.log("==============================================================");
}
