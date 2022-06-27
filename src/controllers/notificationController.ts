import Notification from "../models/notification";
import { Expo, ExpoPushTicket } from "expo-server-sdk";
import User from "./userController";

export default class NotificationController {
  private constructor() {}

  public static async create(userId: number, type: number): Promise<void> {
    const user = await User.getById(userId);
    if (!user) {
      throw new Error("[RETURN] User not found");
    }
    const token: string = user.get("token") as string;
    await Notification.create({
      type,
      user: userId,
    });
    if (!token) return;

    await this.sendPushNotification(type, null, token);
  }

  public static async get(userId: number): Promise<Notification[]> {
    return await Notification.findAll({
      where: { user: userId },
    });
  }

  private static async sendPushNotification(
    type: number,
    message: string | null,
    token: string | string[]
  ): Promise<void> {
    const tokens = token instanceof Array ? token : [token];
    const expo = new Expo();

    let messages = [];
    for (let pushToken of tokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        continue;
      }

      messages.push({
        to: pushToken,
        sound: "default" as "default",
        body: message || "There's new notification",
        data: { type },
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets: ExpoPushTicket[] = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    let receiptIds = [];
    for (let ticket of tickets) {
      if ((ticket as any).id) {
        receiptIds.push((ticket as any).id);
      }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

          for (let receiptId in receipts) {
            let { status, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(`There was an error sending a notification: ${message}`);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
