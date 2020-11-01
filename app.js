const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const nexmo = require("nexmo");
const socketio = require("socket.io");

const app = express();

// api keys

const Nexmo = new nexmo(
  {
    apiKey: "6158501a",
    apiSecret: "sFIshIgDm4vyiHTz",
  },
  { debug: true }
);

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8080 || process.env.PORT;

// index route

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", (req, res) => {
  const from = "Vonage APIs";
  const to = req.body.number;
  const text = req.body.text;

  Nexmo.message.sendSms(
    from,
    to,
    text,
    { type: "unicode" },
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.log(responseData);
        console.dir(responseData);
        const data = {
          id: responseData.messages[0]["message-id"],
          nunber: responseData.messages[0]["to"],
        };

        io.emit("smsStatus", data);
      }
    }
  );
});

const server = app.listen(PORT, () => {
  console.log("Server is running!");
});

// connect tp socket.io

const io = socketio(server);

io.on("connection", (socket) => {
  console.log("Connected!");
  io.on("disconnect", () => {
    console.log("Disconnected!");
  });
});
