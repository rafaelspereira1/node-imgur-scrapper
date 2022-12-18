import * as fs from "fs";
import figlet from "figlet";

figlet("Node Imgur Scrapper", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

if (!fs.existsSync("images")) {
  fs.mkdirSync("images");
}
