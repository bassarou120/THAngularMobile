import { Country } from "./country";

export class User {
  id!: string;
  fullName: string = '';
  phoneNumber: string = '';
  country: Country = new Country();
  email: string = '';
  password: string = '';
  role: string = 'ABONNE'; //ADMINISTRATEUR
  codeVerification: string = '';
  createdAt: any = '';
  updatedAt: any = '';
  isCodeSent = false;
  //complémentaires
  sexe: string = ''; //MASCULIN, FÉMININ
  birthDay: any = '';
  birthCity: string = '';
  profession: string = '';
  status: string = ''; //ACTIF, BLOQUÉ
}
