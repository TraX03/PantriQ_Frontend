import { databases } from "@/services/appwrite";
import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Query } from "react-native-appwrite";

export const safeFetch = async <T>(fn: () => Promise<T[]>): Promise<T[]> => {
  try {
    return await fn();
  } catch (err) {
    console.warn("Fetch failed:", err);
    return [];
  }
};

export const fetchAllDocuments = async (
  collectionId: string
): Promise<any[]> => {
  let documents: any[] = [];
  let lastDoc: any = null;
  const limit = 100;

  while (true) {
    const queries = [Query.limit(limit), Query.orderAsc("$createdAt")];
    if (lastDoc) queries.push(Query.cursorAfter(lastDoc.$id));

    const { documents: newDocs } = await databases.listDocuments(
      AppwriteConfig.DATABASE_ID,
      collectionId,
      queries
    );

    documents = [...documents, ...newDocs];
    if (newDocs.length < limit) break;

    lastDoc = newDocs[newDocs.length - 1];
  }

  return documents;
};
