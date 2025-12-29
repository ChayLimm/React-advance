import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { message } from "antd";

const auth = getAuth();
const db = getFirestore();
import type { UserProp } from "../types/Portfolio";

export const getDocuments = async (): Promise<UserProp | null> => {
  try {
    const userString = localStorage.getItem("user");

    if (!userString) {
      message.error("No user found in localStorage");
      return null;
    }

    let uid: string | undefined;
    try {
      const userData = JSON.parse(userString);
      uid = userData.uid;
    } catch (error) {
      console.error("Error parsing user data:", error);
      message.error("Invalid user data format");
      return null;
    }

    if (!uid) {
      message.error("No user UID found");
      return null;
    }

    const userDocRef = doc(db, "info", uid);
    const snapshot = await getDoc(userDocRef);

    if (!snapshot.exists()) {
      console.log("No document found - creating empty structure");
      return null;
    }

    const data = snapshot.data() as UserProp;
    console.log("Loaded data:", data);

    return {
      ...data,
      projects: data.projects || [],
      skills: data.skills || [],
      experiences: data.experiences || [], // Add this line
    };
  } catch (error) {
    console.error("Error in getDocuments:", error);
    message.error("Failed to load data");
    return null;
  }
};

export const setDocument = async (user: UserProp): Promise<void> => {
  try {
    if (!auth.currentUser) {
      message.error("No authenticated user found");
      return;
    }

    const userDocRef = doc(db, "info", auth.currentUser.uid);

    const cleanUserData: any = {};

    Object.keys(user).forEach((key) => {
      if (key === "uid") return; // Skip uid entirely

      const value = (user as any)[key];
      if (value !== undefined) {
        cleanUserData[key] = value;
      }
    });

    cleanUserData.projects = cleanUserData.projects || [];
    cleanUserData.skills = cleanUserData.skills || [];
    cleanUserData.experiences = cleanUserData.experiences || []; // Add this line

    console.log("Saving data to Firebase:", cleanUserData);

    await setDoc(userDocRef, cleanUserData, { merge: true });
    message.success("Data saved successfully!");
  } catch (error) {
    console.error("Error in setDocument:", error);
    message.error("Failed to save data");
    throw error;
  }
};
