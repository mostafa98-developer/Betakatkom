import UserType from "./userType";
import TranscationType from "./transactionType";
import NotificationType from "./notificationType";

export const Sync = () => {
  const modalToSync = [UserType, TranscationType, NotificationType];
  modalToSync.forEach((modal) => {
    modal.types.forEach(async (type) => {
      await modal.findOrCreate({
        where: { id: type.get("id") as string },
        defaults: {
          ...type.toJSON(),
        },
      });
    });
  });
};
