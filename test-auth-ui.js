const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function runAuthUiTest() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  console.log("Launching Edge browser for Auth UI test...");

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    const consoleLogs = [];
    page.on("console", (msg) => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    console.log("Navigating to http://localhost:3000 ...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // 1. Verify Page Title
    const title = await page.title();
    console.log("✓ Page title:", title);

    // 2. Verify Google Login button in Header
    const loginBtn = await page.waitForSelector("[data-testid='btn-google-login']", { timeout: 5000 });
    const loginBtnText = await page.evaluate((el) => el.innerText.trim(), loginBtn);
    console.log("✓ Header Google Login Button found. Text:", loginBtnText);

    // 3. Verify GuestWelcomeHero
    const heroCta = await page.waitForSelector("[data-testid='btn-guest-login-cta']", { timeout: 5000 });
    const heroCtaText = await page.evaluate((el) => el.innerText.trim(), heroCta);
    console.log("✓ Guest Welcome Hero CTA found. Text:", heroCtaText);

    // 4. Capture screenshot of Guest Mode Homepage
    const artifactDir = "C:\\Users\\anqh3\\.gemini\\antigravity-ide\\brain\\07b1765c-602c-4fb4-bef5-95b3f75735a9";
    const guestScreenshot = path.join(artifactDir, "guest_homepage_view.png");
    await page.screenshot({ path: guestScreenshot, fullPage: true });
    console.log("✓ Captured guest homepage screenshot to:", guestScreenshot);

    // 5. Test clicking "새 링크 추가하기" when not logged in
    console.log("Testing click on '새 링크 추가하기' in guest mode...");
    const addLinkBtn = await page.waitForSelector("[data-testid='open-add-link-dialog']");
    await addLinkBtn.click();

    // Verify dialog pops up with login required message
    await page.waitForFunction(() => document.body.innerText.includes("로그인이 필요한 기능입니다"), { timeout: 3000 });
    console.log("✓ AddLinkDialog properly shows '로그인이 필요한 기능입니다' modal for guests!");

    // 6. Test ShareButton Sonner toast
    console.log("Testing ShareButton link copy with Sonner toast...");
    // Close dialog if open
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 500));

    const shareBtn = await page.waitForSelector("[data-testid='share-button']");
    await shareBtn.click();

    // Verify toast is displayed
    await page.waitForFunction(() => document.body.innerText.includes("클립보드에 복사되었습니다"), { timeout: 3000 });
    console.log("✓ Sonner Toast successfully popped up with text '클립보드에 복사되었습니다'!");

    const toastScreenshot = path.join(artifactDir, "share_toast_view.png");
    await page.screenshot({ path: toastScreenshot });
    console.log("✓ Captured toast screenshot to:", toastScreenshot);

    console.log("\n==========================================");
    console.log(" 🎉 ALL GOOGLE AUTH & GUEST UI TESTS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("Auth UI Test failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAuthUiTest();
