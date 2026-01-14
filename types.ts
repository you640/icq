export enum UserStatus {
  ONLINE = 'Online',
  AWAY = 'Away',
  NA = 'N/A',
  OCCUPIED = 'Occupied',
  DND = 'DND',
  INVISIBLE = 'Invisible',
  OFFLINE = 'Offline'
}

export interface Contact {
  id: string;
  name: string;
  uin: string;
  status: UserStatus;
  isOnline: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  contactId: string;
  messages: Message[];
  inputValue: string;
}

export interface ICQState {
  userStatus: UserStatus;
  contacts: Contact[];
  openChats: string[]; // List of contact IDs with open windows
}
