import admin from "firebase-admin";
import { loadDatabaseConfig } from "../config/config";

const { projectId, privateKey, clientEmail } = loadDatabaseConfig();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
  console.log("Auth Initialized")
} else {
  console.log("Auth already initialized! :)")
}

export default admin;

