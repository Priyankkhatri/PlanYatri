export interface Message {
  id: string;
  contactId: string;
  senderId: string;
  senderType: 'user' | 'contact';
  text: string;
  createdAt: string;
}
