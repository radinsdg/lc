document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const quickBtns = document.querySelectorAll('.quick-btn');

    let userName = localStorage.getItem("su_name") || "کاربر عزیز";

    const callname = document.getElementById('callname');
    if (callname) {
        callname.innerText = `سلام ${userName}، من دستیار هوشمند هستم هر سوالی که داری در خدمتم`;
    }

    function replaceName(text) {
        return text.replace(/\{name\}/g, userName);
    }

    // ===== جواب‌های اختصاصی برای هر دکمه =====
    const specificAnswers = {
        "چطور با سازنده ارتباط برقرار کنم؟": "در صفحه اصلی سایت گوشه پایین یک دکمه به نام CT است اگر بر روی آن کلیک کنید در بله وارد حساب سازنده میشوید. یا وارد لینک زیر شوید https://web.bale.ai/@artinhdg",
        "نحوه نظر دهی به ویدیو هایی که میگزارید چطور است؟": "در صفحه اصلی بالا سمت چپ بر روی نظرات کلیک کرده و نظر خود را مینویسید.",
        "چطور میتوان دوره مورد نظر خود را ذخیره کرد؟": "در زیر دوره مورد دکمه افزودن به دوره های من کلیک کنید.",
        "سازنده تو چه کسی بوده؟": "رادین سرلک",
        "تو چطوری کار میکنی؟ چی هستی؟": "بر روی دکمه ورود حساب کلیک کنید و مراحل را تکمیل کنید.",
        "چطور وارد حساب کاربری بشوم؟": "بر روی دکمه ورود حساب کلیک کنید و مراحل را تکمیل کنید.",
        "پروفایل من کجا ترمیم میشود؟": "با ترمیم حساب کاربری در ورود حساب."
    };

    // ===== پاسخ‌های بر اساس کلمات کلیدی (برای تایپ کاربر) =====
    const standardResponses = [
        { 
            keywords: ['ارتباط', 'سازنده', 'تماس', 'ct'], 
            response: "در صفحه اصلی سایت گوشه پایین یک دکمه به نام CT است اگر بر روی آن کلیک کنید در بله وارد حساب سازنده میشوید." 
        },
        { 
            keywords: ['نظر', 'نظردهی', 'ویدیو', 'نظرات'], 
            response: "در صفحه اصلی بالا سمت چپ بر روی نظرات کلیک کرده و نظر خود را مینویسید." 
        },
        { 
            keywords: ['دوره', 'ذخیره', 'افزودن', 'دوره‌های من'], 
            response: "در زیر دوره مورد دکمه افزودن به دوره های من کلیک کنید." 
        },
        { 
            keywords: ['سازنده', 'چه کسی', 'رادین'], 
            response: "رادین سرلک" 
        },
        { 
            keywords: ['نحوه کار', 'چی هستی', 'چطوری کار', 'کار میکنی', 'کار'], 
            response: "بر روی دکمه ورود حساب کلیک کنید و مراحل را تکمیل کنید." 
        },
        { 
            keywords: ['حساب', 'کاربری', 'ورود', 'اکانت', 'وارد'], 
            response: "بر روی دکمه ورود حساب کلیک کنید و مراحل را تکمیل کنید." 
        },
        { 
            keywords: ['پروفایل', 'ترمیم', 'بازیابی'], 
            response: "با ترمیم حساب کاربری در ورود حساب." 
        }
    ];

    // ===== پاسخ‌های طنز برای سوالات دیگر =====
    const sassyResponses = [
        "{name} جان، این سوالت رو نمی‌دونم! ولی می‌تونم راهنماییت کنم که از بخش راهنما استفاده کنی. 😊",
        "خوب {name}، جواب این سوال رو باید از خودت بپرسی! 😂",
        "من فقط بلدم به سوالات مشخص جواب بدم، سوالت رو واضح‌تر بپرس! 🤔",
        "اوه! این یکی رو نمی‌دونم، ولی می‌تونم یه چیز بامزه بگم... نه، ولش کن! 😅",
        "راستش {name}، من هنوز جواب اینو یاد نگرفتم. شاید دفعه بعد! 😉",
        "این سوال خیلی خاصه، بهتره از پشتیبانی بپرسی! 🙏"
    ];

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    let isTyping = false;

    function addAiMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'ai-message');
        
        const textSpan = document.createElement('span');
        messageDiv.appendChild(textSpan);
        
        chatBox.appendChild(messageDiv);
        
        let index = 0;
        const speed = 20;

        function typeWriter() {
            if (index < text.length) {
                textSpan.textContent += text.charAt(index);
                index++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(typeWriter, speed);
            } else {
                isTyping = false;
            }
        }
        isTyping = true;
        typeWriter();
    }

    function getBotResponse(input) {
        const trimmedInput = input.trim();
        
        // 1. اول چک کن که آیا سوال دقیقاً با یکی از دکمه‌ها مطابقت داره؟
        if (specificAnswers[trimmedInput]) {
            return replaceName(specificAnswers[trimmedInput]);
        }
        
        // 2. اگر نه، بر اساس کلمات کلیدی جستجو کن
        const lowerInput = trimmedInput.toLowerCase();
        const match = standardResponses.find(entry => 
            entry.keywords.some(keyword => lowerInput.includes(keyword))
        );
        
        if (match) {
            return replaceName(match.response);
        }
        
        // 3. اگر هیچکدام نبود، پاسخ طنز بده
        const randomIndex = Math.floor(Math.random() * sassyResponses.length);
        return replaceName(sassyResponses[randomIndex]);
    }

    function handleSend(text) {
        if (!text || text.trim() === "" || isTyping) return;

        const trimmedText = text.trim();
        addUserMessage(trimmedText);

        // غیرفعال کردن دکمه‌ها در حین تایپ ربات
        quickBtns.forEach(btn => btn.disabled = true);

        setTimeout(() => {
            const botResponse = getBotResponse(trimmedText);
            addAiMessage(botResponse);
            
            // فعال کردن مجدد دکمه‌ها
            quickBtns.forEach(btn => btn.disabled = false);
        }, 400);
    }

    // ===== رویدادهای کلیک روی دکمه‌های سریع =====
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const question = this.getAttribute('data-question');
            if (question) {
                handleSend(question);
            }
        });
    });
});