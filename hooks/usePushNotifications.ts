import { AppwriteConfig } from "@/constants/AppwriteConfig";
import { Colors } from "@/constants/Colors";
import {
  createDocument,
  listDocuments,
  updateDocument,
} from "@/services/Appwrite";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";
import { Query } from "react-native-appwrite";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldShowBanner: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  useEffect(() => {
    registerForLocalNotifications();

    const notificationListener = Notifications.addNotificationReceivedListener(
      async (notification) => {
        const { itemName, expiryDate, triggerDate, userId } =
          notification.request.content.data;

        if (!itemName || !expiryDate || !triggerDate) return;

        const existing = await listDocuments(
          AppwriteConfig.NOTIFICATIONS_COLLECTION_ID,
          [
            Query.equal("user_id", userId as string),
            Query.equal("item_name", itemName as string),
            Query.equal("expiry_date", expiryDate as string),
          ]
        );

        const description = `${itemName} expired soon (${triggerDate})`;

        if (existing.length > 0) {
          const doc = existing[0];
          const triggers = Array.isArray(doc.trigger_date)
            ? doc.trigger_date
            : [];

          if (!triggers.includes(triggerDate)) {
            triggers.push(triggerDate);
            await updateDocument(
              AppwriteConfig.NOTIFICATIONS_COLLECTION_ID,
              doc.$id,
              {
                trigger_date: triggers,
              }
            );
          }
        } else {
          await createDocument(AppwriteConfig.NOTIFICATIONS_COLLECTION_ID, {
            user_id: userId,
            item_name: itemName,
            expiry_date: expiryDate,
            trigger_date: [triggerDate],
            description,
          });
        }
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification clicked:", response.notification);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}

async function registerForLocalNotifications() {
  if (!Device.isDevice) {
    console.warn("Must use physical device for notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Notification permissions not granted!");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: Colors.brand.primary,
    });
  }
}
