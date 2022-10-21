const puppeteer = require("puppeteer");
const downloadCsv = require("./downloadCsv");

const loader = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.goto("https://investors.irontoncapital.com/admin/joined_report");
  await page.type("#user_email", process.env.IC_EMAIL);
  await page.type("#user_password", process.env.IC_PASSWORD);
  await Promise.all([
    await page.click('button[type="submit"]'),
    await page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);
  const test = await page.$$("span.action_item");
  await test[0].click();
  await page.waitForNavigation();
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Report generated!")'
  );
  const downloadLink = await page.$eval("#js_flash a", (element) =>
    element.getAttribute("href")
  );
  downloadCsv(downloadLink);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
};

module.exports = loader;
