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
      console.log(data);
      resolve(data);
    });
  });
};

const readConsole = () => {
  const readLine = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readLine.question("How many pictures do you want? " + "\n", (answer) => {
    const numPictures = parseInt(answer, 10);
    console.log(`You want ${numPictures} pictures.`);
    readLine.close();
    return numPictures;
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
    }
  }
}

await asciiArt();
//readConsole();
scrapePictures();
