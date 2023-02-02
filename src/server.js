import express from "express";

const app = express();
//pug설정
app.set("view engine", "pug");
//views로 화면 root set
app.set("views", __dirname + "/views");
//public folder path set
//아래의 경우 해당 파일을 표출할 수 있다.=> 순수하게 파일을 볼 수 있다.
app.use("/public", express.static(__dirname + "/public"));
//default url render home
app.get("/", (req, res) => res.render("home"));
const handleListen = () => console.log(`Listening on http:localhost:3000`);
app.listen(3000, handleListen);
