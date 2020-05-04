const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");
const path = require("path");
let i = 2;
async function netbian(i) {
  const pathToExtension = require("path").join(
    __dirname,
    "./chrome-win/chrome.exe"
  );
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: pathToExtension,
  });
  const page = await browser.newPage();
  await page.goto(`http://pic.netbian.com/4kfengjing/index_${i}.html`);
  let images = await page.$$eval("ul>li>a>img", (el) =>
    el.map((x) => "http://pic.netbian.com" + x.getAttribute("src"))
  );
  mkdirSync(`./images`); // 存放目录
  for (m of images) {
    await downloadImg(m, "./images/" + new Date().getTime() + ".jpg");
  }

  netbian(++i);
  // 关闭
  await browser.close();
}
netbian(i);

// 同步创建目录
function mkdirSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false;
}

// 下载文件 保存图片
async function downloadImg(src, path) {
  return new Promise(async function (resolve, reject) {
    let writeStream = fs.createWriteStream(path);
    let readStream = await request(src);
    await readStream.pipe(writeStream);
    readStream.on("end", function () {
      console.log("文件下载成功");
    });
    readStream.on("error", function () {
      console.log("错误信息:" + err);
    });
    writeStream.on("finish", function () {
      console.log("文件写入成功");
      writeStream.end();
      resolve();
    });
  });
}
