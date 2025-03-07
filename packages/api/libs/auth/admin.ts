import admin from "firebase-admin";
import config from "../config";
import { AuthMode } from "./authMiddleware";

const { projectId, privateKey, clientEmail, authMode } = config;

if (!admin.apps.length && authMode === "FIREBASE") {
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
