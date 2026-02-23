import { sendEmail } from "../services/emailService.js";

export async function sendTestEmail(req, res) {
  const { to, subject, body } = req.body;
  try {
    const result = await sendEmail(to, subject, body);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
