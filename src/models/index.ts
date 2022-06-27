import _User from "./user";
import _UserType from "./userType";
import _Card from "./card";
import _CardType from "./cardType";
import _Transaction from "./transaction";
import _TransactionType from "./transactionType";
import _Notification from "./notification";
import _NotificationType from "./notificationType";

import _Wallet from "./wallet";

import Connection from "./connection";
import { Sync } from "./staticData";

export const User = _User;
export const UserType = _UserType;

export const Card = _Card;
export const CardType = _CardType;

export const Transaction = _Transaction;
export const TransactionType = _TransactionType;

export const Notification = _Notification;
export const NotificationType = _NotificationType;

export const Wallet = _Wallet;

Connection.sync().then(() => Sync());
