const puppeteer = require("puppeteer");
const downloadCsv = require("./downloadCsv");
const { postgres } = require("../../dbClient");

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
  const reportButton = await page.$$("span.action_item");
  await reportButton[0].click();
  await page.waitForNavigation();
  await page.waitForFunction(
    'document.querySelector("body").innerText.includes("Report generated!")'
  );
  const downloadLink = await page.$eval("#js_flash a", (element) =>
    element.getAttribute("href")
  );
  const parcedCsv = await downloadCsv(downloadLink);
  await postgres.truncate("ic_uc_joined_report");
  await postgres.insertByColumns("ic_uc_joined_report", parcedCsv);
  await browser.close();
};

module.exports = loader;
