import { User } from "./user";

export class Campagne {
  id!: string;
  title: string = '';
  content: string = '';
  postedBy: User = new User();
  postedAt: any = '';
  updatedAt: any = '';
  limitedAt: any = '';
  status: string = ''; //POSTÉ, CLÔTURÉ
  mois: string = '';
  annee: string = '';
  visibilite: string = ''; // TOUT LE MONDE, GROUPE D'ABONNÉS, ABONNÉS D'UN PAYS, UN SEUL ABONNÉ
  countryId: string = '';
  userList: User[] = [];
  usersIds: number[] = [];
  nombreGagnant: number = 0;
  nombrePublication: number = 0;
}
