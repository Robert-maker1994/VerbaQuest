import admin from "firebase-admin";
import { loadConfig } from "../config/config";

const { projectId, privateKey, clientEmail } = loadConfig();

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId,
			clientEmail,
			privateKey: privateKey.replace(/\\n/g, "\n"),
		}),
	});
	console.log("Auth Initialized");
} else {
	console.log("Auth already initialized! :)");
}

export default admin;
