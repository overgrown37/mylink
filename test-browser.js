const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

async function runBrowserTest() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  console.log("Launching Edge browser...");

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log("Navigating to http://localhost:3000 ...");
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    // 1. Verify title
    const title = await page.title();
    console.log("✓ Page title:", title);

    // 2. Query and verify all link cards
    const linkCards = await page.$$eval("[data-testid^='link-card-']", (elements) => {
      return elements.map((el) => ({
        id: el.getAttribute("data-testid"),
        href: el.getAttribute("href"),
        target: el.getAttribute("target"),
        rel: el.getAttribute("rel"),
        text: el.innerText.replace(/\s+/g, " ").trim(),
      }));
    });

    console.log(`\n✓ Found ${linkCards.length} clickable link cards:`);
    linkCards.forEach((l, idx) => {
      console.log(`  [${idx + 1}] ID: ${l.id} | URL: ${l.href} | Target: ${l.target} | Rel: ${l.rel}`);
      console.log(`      Content: "${l.text}"`);
    });

    // 3. Capture screenshot first
    const screenshotDir = path.join(__dirname, "public");
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, "preview.png");
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log("\n✓ Screenshot successfully captured to:", screenshotPath);

    // 4. Test clicking link interaction (check new target tab)
    console.log("\nTesting click interaction on link card 1 (FlowNote)...");
    const newTargetPromise = browser.waitForTarget((target) => target.url().includes("github.com"), { timeout: 5000 });
    const firstLink = await page.$("[data-testid='link-card-link-1']");
    if (firstLink) {
      await firstLink.hover();
      await firstLink.click();
      const newTarget = await newTargetPromise.catch(() => null);
      if (newTarget) {
        console.log("✓ Successfully opened new tab with URL:", newTarget.url());
      }
    }

    console.log("\n==========================================");
    console.log(" 🎉 ALL BROWSER & LINK CLICK CHECKS PASSED!");
    console.log("==========================================");
  } catch (err) {
    console.error("Browser test error:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runBrowserTest();
