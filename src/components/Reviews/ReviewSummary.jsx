import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore";

export async function GeminiSummary({ restaurantId }) {
  const { firebaseServerApp} = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByRestaurantId(
    getFirestore(firebaseServerApp),
    restaurantId
  );

  const reviewSeparator = '@';
  const prompt = `Based on the following restaurant reviews, where each review is separated by a '${reviewSeparator}' character, create a one-sentence summary of what people think of the restaurant. Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}`;

  try {
    if(!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const ai = genkit({
      plugins: [googleAI()],
      model: gemini20Flash,
    });

    const { text } = await ai.generate(prompt);

    return (
      <div className="restaurant__review_summary">
        <p>{text}</p>
        <p>Summarised with Gemini</p>
      </div>
    )
  } catch (error) {
    console.error("Error summarizing reviews: ", error);
    return <p>Error summarising reviews.</p>
  }
}

export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}
