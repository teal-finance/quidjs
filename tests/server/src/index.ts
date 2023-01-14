import express, { Express, Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import { conf } from "./conf";
import { IncomingMessage, Server, ServerResponse } from 'http';

var morgan = require('morgan')

dotenv.config();

const PORT = process.env.PORT || 5714;
const app: Express = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }))
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(verifyjwt);

function verifyjwt(req: Request, res: Response, next: NextFunction) {
  //console.log("HEAD", req.headers)
  const bearer = req.headers['authorization']
  if (!bearer) {
    console.log("User has no token")
    return res.status(401).json('Unauthorized user')
  }
  const token = bearer.split(" ")[1]
  console.log("Verifying token", token)
  console.log("with hexadecimal key", conf.namespaceKey)
  try {
    jwt.verify(token, conf.namespaceKey, function (err, decoded) {
      if (err) {
        console.log("Token unverified", err);
        return res.status(401).json('Wrong token')
      } else {
        console.log("Decoded token", decoded)
      }
    });
  } catch (e) {
    return res.status(401).json('Token not valid')
  }
  next()
}

app.get('/', (req: Request, res: Response) => {
  res.send({ "response": "ok" })
});

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

function start() {
  server = app.listen(PORT, () => console.log(`Test server running on ${PORT} ⚡`));
}

function stop() {
  server.close()
}

export { start, stop }
