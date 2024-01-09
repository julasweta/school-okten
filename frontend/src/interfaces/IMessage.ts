export interface Message {
  _id: string;
  text: string;
  userId: string;
  orderId: string;
  date: string; 
}

export interface IMessages{
  data: Message[]
}