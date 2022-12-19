import * as fs from "fs";
import * as readline from "readline";
import figlet from "figlet";

if (!fs.existsSync("images")) {
  console.log("Creating images folder...");
  fs.mkdirSync("images");
}

const asciiArt = () => {
  return new Promise((resolve, reject) => {
    figlet("Node Imgur Scrapper", function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        reject(err);
      }
      console.log(data + "\n");
      resolve(data);
    });
  });
};

const readConsole = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const readLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    // The unary + operator is used to convert its operand to a number.
    readLine.question("How many images do you want to download? ", (answer) => {
      if (isNaN(+answer)) {
        console.log("Please enter a number.");
        readLine.close();
        reject();
      } else {
        readLine.close();
        console.log(`Downloading ${answer} images...`);
        resolve(+answer);
      }
    });
  });
};

const generateUrl = (url: string = "https://i.imgur.com/") => {
  const length = Math.random() < 0.5 ? 5 : 6;
  if (length === 5) {
    url += Array(5)
      .fill("")
      .map(() => Math.random().toString(36)[2])
      .join("");
    url += ".jpeg";
  } else {
    url += Array(3)
      .fill("")
      .map(() => Math.random().toString(36)[2])
      .join("");
    url += Array(3)
      .fill("")
      .map(() => Math.random().toString(36)[2])
      .join("");
    url += ".jpg";
  }
  console.log(url);
  return url;
};

async function scrapePictures() {
  let currentValueDownloaded = 0;
  const downloadLimit = await readConsole();
  while (true) {
    const url = generateUrl();
    const response = await fetch(url);

    // Check the Content-Type header to see if the response is an image.
    const contentType = response.headers.get("Content-Type");
    if (!contentType?.startsWith("image/")) {
      console.log(`[-] Invalid: ${url}`);
      continue;
    }

    // If the response is an image, read the data and save it to a file.
    const data = await response.arrayBuffer();
    const file = `images/${Date.now()}.jpg`;
    fs.writeFileSync(file, Buffer.from(data));

    // Check the file size to see if it is valid.
    const fileSize = fs.statSync(file).size;
    const INVALID_SIZES = [0, 7, 503, 5082, 4939, 4940, 4941, 12003, 5556];
    if (INVALID_SIZES.includes(fileSize)) {
      console.log(`[-] Invalid: ${url}`);
      fs.unlinkSync(file);
    } else {
      console.log(`[+] Valid: ${url}`);
      currentValueDownloaded++;
    }
    if (currentValueDownloaded === downloadLimit) {
      console.log("Download complete!");
      break;
    }
  }
}

await asciiArt();
scrapePictures();
