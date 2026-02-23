import net from "net";
import tls from "tls";
import dotenv from "dotenv";

dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

export async function sendEmail(to, subject, body, from = SMTP_USER) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(SMTP_PORT, SMTP_HOST);

    socket.on("error", (err) => {
      reject(`Connection error: ${err.message}`);
    });

    socket.on("connect", () => {
      const tlsSocket = tls.connect(
        { socket, host: SMTP_HOST },
        () => {
          const commands = [
            `EHLO ${SMTP_HOST}`,
            `AUTH LOGIN`,
            Buffer.from(SMTP_USER).toString("base64"),
            Buffer.from(SMTP_PASS).toString("base64"),
            `MAIL FROM:<${from}>`,
            `RCPT TO:<${to}>`,
            `DATA`,
            `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\n\r\n${body}\r\n.`,
            `QUIT`,
          ];

          let i = 0;

          const sendCommand = () => {
            if (i < commands.length) {
              tlsSocket.write(commands[i] + "\r\n");
              i++;
            } else {
              tlsSocket.end();
              resolve("Email sent successfully!");
            }
          };

          tlsSocket.on("data", () => {
            sendCommand();
          });

          tlsSocket.on("error", (err) => {
            reject(`Error: ${err.message}`);
          });

          sendCommand();
        }
      );
    });
  });
}
