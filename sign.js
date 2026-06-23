function signupUser() {
    let name = document.getElementById("su_name").value.trim();
    let user = document.getElementById("su_user").value.trim();
    let pass = document.getElementById("su_pass").value.trim();
    let num = document.getElementById("su_num").value.trim();
    
    // بررسی خالی بودن فیلدها
    if (name === "" || user === "" || pass === "") {
        document.getElementById("signupMsg").innerText = "❌ لطفاً تمام فیلدهای ضروری را پر کنید";
        return;
    }

    // اعتبارسنجی نام و نام خانوادگی (فقط حروف فارسی)
    const persianRegex = /^[\u0600-\u06FF\s]+$/;
    if (!persianRegex.test(name)) {
        document.getElementById("signupMsg").innerText = "❌ نام و نام‌خانوادگی باید فارسی باشد";
        return;
    }

    // اعتبارسنجی نام کاربری
    if (user.length < 2) {
        document.getElementById("signupMsg").innerText = "❌ نام کاربری حداقل 2 کاراکتر";
        return;
    }

    // بررسی تکراری نبودن نام کاربری
    let existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.some(u => u.username === user)) {
        document.getElementById("signupMsg").innerText = "❌ نام کاربری قبلا استفاده شده";
        return;
    }

    // اعتبارسنجی رمز عبور (حداقل 4 کاراکتر)
    if (pass.length < 4) {
        document.getElementById("signupMsg").innerText = "❌ رمز عبور حداقل 4 کاراکتر";
        return;
    }

    // اعتبارسنجی شماره موبایل (اختیاری)
    if (num !== "" && !/^09[0-9]{9}$/.test(num)) {
        document.getElementById("signupMsg").innerText = "❌ شماره موبایل صحیح نیست";
        return;
    }

    // ذخیره اطلاعات کاربر جدید
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
        username: user,
        name: name,
        password: pass,
        phone: num
    });
    localStorage.setItem("users", JSON.stringify(users));

    // ذخیره اطلاعات جلسه فعلی
    localStorage.setItem("signedUp", "true");
    localStorage.setItem("su_name", name);
    localStorage.setItem("su_user", user);

    document.getElementById("signupMsg").innerText = "✅ ثبت‌نام با موفقیت انجام شد!";
    document.getElementById("signupMsg").style.color = "green";

    // انتقال به صفحه اصلی بعد از 1 ثانیه
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
}