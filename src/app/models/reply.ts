import { User } from "./user";

export class Reply {
  content: string = '';
  postedBy: User = new User();
  updatedAt: any = '';
}
