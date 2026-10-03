const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function testAddLink() {
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

    // Initial link count
    const initialCount = await page.$$eval("[data-testid^='link-card-']", (els) => els.length);
    console.log(`Initial link cards count: ${initialCount}`);

    // 2. Open Add Link Dialog
    console.log("2. Clicking '새 링크 추가하기' button to open Dialog...");
    const openBtn = await page.$("[data-testid='open-add-link-dialog']");
    if (!openBtn) throw new Error("Could not find open dialog button!");
    await openBtn.click();

    // Wait for dialog content to appear
    await page.waitForSelector("[data-slot='dialog-content']", { visible: true });
    console.log("✓ Add Link Dialog successfully opened!");

    // Capture screenshot of Dialog
    const screenshotDir = path.join(__dirname, "public");
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    await page.screenshot({ path: path.join(screenshotDir, "dialog-preview.png") });
    console.log("✓ Captured dialog screenshot to public/dialog-preview.png");

    // 3. Fill form
    console.log("3. Filling in link details...");
    await page.type("[data-testid='input-link-title']", "내 새로운 기술 포트폴리오");
    await page.type("[data-testid='input-link-url']", "https://portfolio.example.com");
    await page.type("[data-testid='input-link-subtitle']", "2026년 최신 프로젝트 및 이력서 모음");
    await page.type("[data-testid='input-link-badge']", "NEW");
    await page.click("[data-testid='checkbox-link-featured']");

    // 4. Submit form
    console.log("4. Submitting form...");
    await page.click("[data-testid='btn-submit-link']");

    // Wait for dialog to close
    await page.waitForSelector("[data-slot='dialog-content']", { hidden: true });
    console.log("✓ Dialog closed.");

    // Wait a brief moment for state and DOM to update
    await new Promise((r) => setTimeout(r, 600));

    // 5. Verify new link card in DOM
    const finalLinks = await page.$$eval("[data-testid^='link-card-']", (elements) => {
      return elements.map((el) => ({
        id: el.getAttribute("data-testid"),
        href: el.getAttribute("href"),
        text: el.innerText.replace(/\s+/g, " ").trim(),
      }));
    });

    console.log(`\nFinal link cards count: ${finalLinks.length}`);
    const addedLink = finalLinks.find((l) => l.text.includes("내 새로운 기술 포트폴리오"));
    if (addedLink) {
      console.log("🎉 SUCCESS! Newly added link found in page:");
      console.log(`   ID: ${addedLink.id}`);
      console.log(`   URL: ${addedLink.href}`);
      console.log(`   Text: "${addedLink.text}"`);
    } else {
      throw new Error("Newly added link not found in DOM!");
    }

    // 6. Capture full page screenshot with new link
    const finalScreenshotPath = path.join(screenshotDir, "added-link-preview.png");
    await page.screenshot({ path: finalScreenshotPath, fullPage: true });
    console.log("✓ Captured final page screenshot to public/added-link-preview.png");

    console.log("\n==========================================");
    console.log(" 🎉 ALL ADD LINK DIALOG CHECKS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testAddLink();
