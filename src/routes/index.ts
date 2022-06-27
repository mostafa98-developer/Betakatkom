import user from "./user";
import users from "./users";
import authentication from "./authentication";
import transaction from "./transaction";
import cardType from "./cardType";
import card from "./card";
import Notifications from "./notifications";

export const PrivateRoutes = [user, users, transaction, cardType, card, Notifications];
export const PublicRoutes = [authentication];
