import { User } from "./user";

export class Messagerie {
  id!: string;
  title: string = '';
  content: string = '';
  mediaLink: string = '';
  postedBy: User = new User();
  postedAt: any = '';
  updatedAt: any = '';
  type: string = ''; //Envoi, Réception
  status: string = ''; //Important, Archivé
  mois: string = '';
  annee: string = '';
  visibilite: string = ''; // TOUT LE MONDE, GROUPE D'ABONNÉS, ABONNÉS D'UN PAYS, UN SEUL ABONNÉ
  countryId: string = '';
  userList: User[] = [];
  usersIds: number[] = [];
}
