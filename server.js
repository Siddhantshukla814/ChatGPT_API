const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
var bodyParser = require("body-parser");
const multer = require("multer");
var upload = multer();

const app = express();
require("dotenv").config();

app.set("view engine", "hbs");
app.use(bodyParser.json());

app.use(upload.array());
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/prompt", function (req, res) {
  const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
  });

  const openai = new OpenAIApi(configuration);

  (async () => {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "assistant", content: "Write in Javascript" },
        {
          role: "user",
          content: req.body.userInput,
        },
      ],
    });
    console.log(completion.data.choices[0].message.content);

    res.render("result", {
      response: completion.data.choices[0].message.content,
      formInput: req.body.userInput,
    });
  })();
});

app.listen(3000, () => console.log("Server running on port 3000"));
