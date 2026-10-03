const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function testValidation() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  console.log("Launching Edge browser...");

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 900, isMobile: true, hasTouch: true });

    console.log("1. Navigating to http://localhost:3000 ...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // Open Add Link Dialog
    console.log("2. Opening Add Link Dialog...");
    await page.click("[data-testid='open-add-link-dialog']");
    await page.waitForSelector("[data-slot='dialog-content']", { visible: true });

    // Step A: Submit empty form to trigger required field errors
    console.log("3. Submitting empty form to trigger required field errors...");
    await page.click("[data-testid='btn-submit-link']");
    await new Promise((r) => setTimeout(r, 600));

    // RHF + Zod 에러는 p 태그 (FieldError 컴포넌트) 로 렌더링됨
    const errors = await page.$$eval("form p", (els) => els.map((el) => el.innerText.trim()).filter(Boolean));
    console.log("  검출된 에러 메시지:", errors);

    const hasTitleError = errors.some((e) => e.includes("제목"));
    const hasUrlError   = errors.some((e) => e.includes("URL"));

    console.log("✓ Title validation error detected:", hasTitleError);
    console.log("✓ URL validation error detected:", hasUrlError);

    if (!hasTitleError || !hasUrlError) {
      throw new Error("Validation errors were not displayed on empty submit! Got: " + JSON.stringify(errors));
    }

    // Capture screenshot
    const screenshotDir = path.join(__dirname, "public");
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, "validation-error-preview.png") });
    console.log("✓ Captured validation error screenshot to public/validation-error-preview.png");

    // Step B: Enter invalid URL
    console.log("4. Testing invalid URL format validation...");
    await page.type("[data-testid='input-link-title']", "유효한 제목");
    await page.type("[data-testid='input-link-url']", "not-a-valid-url");
    await page.click("[data-testid='btn-submit-link']");
    await new Promise((r) => setTimeout(r, 600));

    const errors2 = await page.$$eval("form p", (els) => els.map((el) => el.innerText.trim()).filter(Boolean));
    console.log("  검출된 에러 메시지:", errors2);

    const hasInvalidUrlError = errors2.some((e) => e.includes("URL") || e.includes("형식"));
    console.log("✓ Invalid URL error detected:", hasInvalidUrlError);
    if (!hasInvalidUrlError) {
      throw new Error("Invalid URL error was not displayed! Got: " + JSON.stringify(errors2));
    }

    // Step C: Clear URL field and enter valid URL, then submit
    console.log("5. Testing valid URL submission...");
    await page.$eval("[data-testid='input-link-url']", (el) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(el, "");
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    });

    await page.type("[data-testid='input-link-url']", "https://velog.io/@vibe");
    await page.click("[data-testid='btn-submit-link']");

    // Wait for dialog to close
    await page.waitForSelector("[data-slot='dialog-content']", { hidden: true, timeout: 5000 });
    console.log("✓ Form submitted successfully and dialog closed!");

    console.log("\n==========================================");
    console.log(" 🎉 ALL INPUT VALIDATION CHECKS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("Validation test error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testValidation();
