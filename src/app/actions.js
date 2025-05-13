"use server";

import { addReviewToRestaurant } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";
import { getFirestore } from "firebase/firestore";

// This is a Server Action
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
// Replace the function below
export async function handleReviewFormSubmission(data) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  console.log("app", firebaseServerApp);
  const db = getFirestore(firebaseServerApp);
  console.log("db", db);

  await addReviewToRestaurant(db, data.get("restaurantId"), {
    text: data.get("text"),
    rating: data.get("rating"),

    userId: data.get("userId"),
  });
}
