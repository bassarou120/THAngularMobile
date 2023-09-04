import { Messagerie } from "./messagerie";
import { User } from "./user";

export class Gagnant {
  id!: string;
  user: User = new User();
  idcampagne: string = '';
  titrecamapagne: string = '';
  mois: string = '';
  annee: string = '';
  postedAt: any = '';
  mediaLink: string = '';
  content: string = '';
  postedBy: User = new User();
  video_id: string = '';
}
