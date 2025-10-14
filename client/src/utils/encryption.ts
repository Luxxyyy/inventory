import CryptoJS from "crypto-js";

const secretKey = "my_super_secret_key_123!";

export function encryptMessage(message: any): string {
  try {
    if (message === null || message === undefined) return "";

    const str =
      typeof message === "string"
        ? message
        : typeof message === "object"
        ? JSON.stringify(message)
        : String(message);

    if (str.length > 50000) {
      console.warn("⚠️ encryptMessage: message too long, skipping encryption");
      return str;
    }

    return CryptoJS.AES.encrypt(str, secretKey).toString();
  } catch (err) {
    console.error("encryptMessage error:", err);
    return String(message || "");
  }
}

export function decryptMessage(ciphertext: string): string {
  if (!ciphertext) return "";

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return ciphertext;
    return decrypted;
  } catch {
    return ciphertext;
  }
}
    