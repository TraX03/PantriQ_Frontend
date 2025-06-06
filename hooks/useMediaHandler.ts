import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { storage } from "@/services/appwrite";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import { ID, Permission, Role } from "react-native-appwrite";

export function useMediaHandler() {
  const pickImageFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) return null;

    const asset = result.assets[0];
    const fileInfo = await FileSystem.getInfoAsync(asset.uri);
    const mimeType = mime.getType(asset.uri) || "application/octet-stream";

    return {
      name: asset.fileName || `image_${Date.now()}`,
      type: mimeType,
      size: fileInfo.exists ? fileInfo.size ?? 0 : 0,
      uri: asset.uri,
    };
  };

  const uploadFile = async (
    file: { name: string; type: string; size: number; uri: string },
    userId: string,
    permissions?: string[]
  ): Promise<string | null> => {
    try {
      const uploaded = await storage.createFile(
        AppwriteConfig.BUCKET_ID,
        ID.unique(),
        file,
        permissions ?? [
          Permission.read(Role.user(userId)),
          Permission.write(Role.user(userId)),
        ]
      );
      return uploaded.$id;
    } catch (err) {
      console.error(`Failed to upload image: ${file.name}`, err);
      return null;
    }
  };

  return { pickImageFile, uploadFile };
}
