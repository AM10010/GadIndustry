(function () {
  /* =====================================================
     CONFIG — edit these values only
     ===================================================== */
  const RECEIVER_EMAIL = "mabanoub826@gmail.com";
  const EMAIL_SUBJECT  = "New registration – 50 years event";

  // Event start. Keep the offset of the event's city
  // (+03:00 = Cairo summer time, +02:00 = Cairo winter time).
  const EVENT_START = "2026-11-27T12:00:00+03:00";
  const EVENT_TZ    = "Africa/Cairo";   // timezone used to DISPLAY date/time

  // Location. Best accuracy: paste the exact hotel name + city/address,
  // or use coordinates like "30.0444,31.2357".
  const MAP_QUERY = "Trump Hotel";
  /* ===================================================== */

  const ENDPOINT = "https://formsubmit.co/ajax/" + encodeURIComponent(RECEIVER_EMAIL);
  const startMs = new Date(EVENT_START).getTime();

  const mapsLink  = "https://maps.app.goo.gl/vLKj4MfqKjYrY1DH8?g_st=it" 
  const mapsEmbed =  "https://www.google.com/maps?q=Hospital+St.+Demiana,+El+Omraniya,+Giza,+Egypt&output=embed"

  const i18n = {
    en: {
      dir: "ltr", lang: "en", locale: "en-US", btn: "العربية",
      title: "50 years",
      place: "trump hotel",
      name: "Full name", email: "Email", phone: "Phone",
      company: "Company (optional)", register: "Register",
      sending: "Sending...",
      startsIn: "Event starts in",
      days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      started: "The event has started.",
      openMap: "Open in Google Maps",
      errName: "Please enter your full name.",
      errEmail: "Please enter a valid email.",
      errPhone: "Please enter your phone number.",
      success: "Thank you! Your registration has been sent.",
      fail: "Something went wrong. Please try again."
    },
    ar: {
      dir: "rtl", lang: "ar", locale: "ar-EG", btn: "English",
      title: "٥٠ عامًا",
      place: "فندق ترامب",
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      company: "الشركة (اختياري)", register: "تسجيل",
      sending: "جارٍ الإرسال...",
      startsIn: "يبدأ الحدث بعد",
      days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية",
      started: "لقد بدأ الحدث.",
      openMap: "فتح في خرائط جوجل",
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

  /* ---------- Date & time (auto-formatted per language) ---------- */
  function fmtDate(code) {
    return new Intl.DateTimeFormat(i18n[code].locale, {
      weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: EVENT_TZ
    }).format(startMs);
  }
  function fmtTime(code) {
    return new Intl.DateTimeFormat(i18n[code].locale, {
      hour: "numeric", minute: "2-digit", timeZone: EVENT_TZ
    }).format(startMs);
  }

  /* ---------- Countdown ---------- */
  function num(n, pad) {
    return new Intl.NumberFormat(i18n[current].locale, {
      minimumIntegerDigits: pad, useGrouping: false
    }).format(n);
  }

  function tick() {
    const diff = startMs - Date.now();
    const done = diff <= 0;
    $("countdownGrid").classList.toggle("d-none", done);
    $("cdDone").classList.toggle("d-none", !done);
    document.querySelector(".countdown-title").classList.toggle("d-none", done);
    if (done) return;

    const s = Math.floor(diff / 1000);
    $("cdDays").textContent    = num(Math.floor(s / 86400), 2);
    $("cdHours").textContent   = num(Math.floor((s % 86400) / 3600), 2);
    $("cdMinutes").textContent = num(Math.floor((s % 3600) / 60), 2);
    $("cdSeconds").textContent = num(s % 60, 2);
  }

  /* ---------- UI helpers ---------- */
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
    $("eventDate").textContent = fmtDate(code);
    $("eventTime").textContent = fmtTime(code);
    $("eventPlace").textContent = t.place;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t[el.dataset.i18n];
    });
    hideAlert();
    tick();
  }

  /* ---------- Map links ---------- */
  $("eventPlaceLink").href = mapsLink;
  $("mapOverlay").href = mapsLink;
  $("mapFrame").src = mapsEmbed;

  $("langBtn").addEventListener("click", () => applyLang(current === "en" ? "ar" : "en"));

  /* ---------- Form ---------- */
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
      "Event": i18n.en.title + " – " + fmtDate("en") + " " + fmtTime("en") + " – " + i18n.en.place,
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

  /* ---------- Init ---------- */
  applyLang("en");
  setInterval(tick, 1000);
})();
