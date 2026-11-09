(function () {
  /* =====================================================
     CONFIG — put the email that should receive the data
     ===================================================== */
  const RECEIVER_EMAIL = "mabanoub826@gmail.com";   // <-- CHANGE THIS
  const EMAIL_SUBJECT  = "New registration – 50 years event";
  /* ===================================================== */

  const ENDPOINT = "https://formsubmit.co/ajax/" + encodeURIComponent(RECEIVER_EMAIL);

  const i18n = {
    en: {
      dir: "ltr", lang: "en", btn: "العربية",
      title: "50 years",
      date: "Tuesday, October 27, 2026 at 12:00 PM",
      place: "trump hotel",
      name: "Full name", email: "Email", phone: "Phone",
      company: "Company (optional)", register: "Register",
      sending: "Sending...",
      errName: "Please enter your full name.",
      errEmail: "Please enter a valid email.",
      errPhone: "Please enter your phone number.",
      success: "Thank you! Your registration has been sent.",
      fail: "Something went wrong. Please try again."
    },
    ar: {
      dir: "rtl", lang: "ar", btn: "English",
      title: "٥٠ عامًا",
      date: "الثلاثاء، ٢٧ أكتوبر ٢٠٢٦ في ١٢:٠٠ ظهرًا",
      place: "فندق ترامب",
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      company: "الشركة (اختياري)", register: "تسجيل",
      sending: "جارٍ الإرسال...",
      errName: "يرجى إدخال اسمك الكامل.",
      errEmail: "يرجى إدخال بريد إلكتروني صحيح.",
      errPhone: "يرجى إدخال رقم هاتفك.",
      success: "شكرًا لك! تم إرسال تسجيلك.",
      fail: "حدث خطأ ما. يرجى المحاولة مرة أخرى."
    }
  };

  let current = "en";
  const $ = (id) => document.getElementById(id);
  const alertBox = $("formAlert");

  function showAlert(type, msg) {
    alertBox.className = "alert alert-" + type;
    alertBox.textContent = msg;
  }
  function hideAlert() { alertBox.className = "alert d-none"; }

  function setLoading(on) {
    $("submitBtn").disabled = on;
    $("spinner").classList.toggle("d-none", !on);
    $("submitLabel").textContent = on ? i18n[current].sending : i18n[current].register;
  }

  function applyLang(code) {
    const t = i18n[code];
    current = code;
    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    $("langLabel").textContent = t.btn;
    $("eventTitle").textContent = t.title;
    $("eventDate").textContent = t.date;
    $("eventPlace").textContent = t.place;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t[el.dataset.i18n];
    });
    hideAlert();
  }

  $("langBtn").addEventListener("click", () => applyLang(current === "en" ? "ar" : "en"));

  $("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    hideAlert();

    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const ok = input.value.trim() !== "" && input.checkValidity();
      input.classList.toggle("is-invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    const payload = {
      "Full name": form.fullName.value.trim(),
      "Email": form.email.value.trim(),
      "Phone": form.phone.value.trim(),
      "Company": form.company.value.trim() || "-",
      "Event": i18n.en.title + " – " + i18n.en.date + " – " + i18n.en.place,
      _subject: EMAIL_SUBJECT,
      _template: "table",
      _captcha: "false",
      _honey: form._honey.value
    };

    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && String(data.success) !== "false") {
        showAlert("success", i18n[current].success);
        form.reset();
      } else {
        showAlert("danger", i18n[current].fail);
      }
    } catch (err) {
      showAlert("danger", i18n[current].fail);
    } finally {
      setLoading(false);
    }
  });
})();