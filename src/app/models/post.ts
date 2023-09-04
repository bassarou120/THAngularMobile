import { User } from "./user";

export class Post {
  id!: string;
  content: string = '';
  mediaLink: string = '';
  postedBy: User = new User();
  postedAt: any = '';
  idcampagne: string = '';
  annee: string = '';
  mois: string = '';
  status: string = ''; //POSTÉ, BLOQUÉ, GAGNÉ
  video_id: string = '';
  titrecamapagne: string = '';
}
