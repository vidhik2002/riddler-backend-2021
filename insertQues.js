
//yes all the answers are idk give it a try :)

const mongoose = require("mongoose");
require("dotenv/config");
const question = require("./models/Question");

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Connection to mongoDB established");
  })
  .on("error", (err) => {
    console.log("Error connecting to mongoDB:", err);
  });

const bridge = [36, 35, 23, 24, 12, 11];
const starting = [37, 38, 39];
const portal = [9, 20, 32];
const track1 = [13, 15, 16, 14, 17, 20, 18, 19, 21, 22, 39];
const track2 = [1, 2, 5, 8, 9, 3, 4, 6, 7, 10, 35, 37];
const track3 = [34, 33, 31, 32, 30, 25, 26, 29, 27, 28, 38, 35];
const track12 = [11, 12];
const track23 = [35, 36];
const track13 = [23, 24];

for (let i = 1; i < 41; i++) {
  let track = [];
  if (track1.includes(i)) track = [1, 1];
  if (track2.includes(i)) track = [2, 2];
  if (track3.includes(i)) track = [3, 3];
  if (track12.includes(i)) track = [1, 2];
  if (track23.includes(i)) track = [2, 3];
  if (track13.includes(i)) track = [1, 3];
  if (i===40) track[1,2,3]

  let pointType = 0;

  if (portal.includes(i)) {
    pointType = 2;
  } else if (bridge.includes(i)) pointType = 3;
  else {
    pointType = 1;
  }

  question.create({
    question: {
      text: `question ${i}?`,
      img: [
        "https://cdn.vox-cdn.com/thumbor/HWPOwK-35K4Zkh3_t5Djz8od-jE=/0x86:1192x710/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg",
      ],
      links: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    },
    answer: portal.includes(i)? ["idk","udk"]:["idk"],
    questionId: i,
    isPortal: portal.includes(i),
    isStarting: starting.includes(i),
    pointType: pointType,
    hint: {
      text: `hint ${i}`,
      img: [
        "https://cdn.vox-cdn.com/thumbor/HWPOwK-35K4Zkh3_t5Djz8od-jE=/0x86:1192x710/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/22312759/rickroll_4k.jpg",
      ],
      links: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    },
    track: track,
  });
}
