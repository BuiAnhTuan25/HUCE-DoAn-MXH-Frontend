import { GENDER } from "./gender";

export class ProfileSearchRequest {
    idMe?: number;
    name?: string;
    phoneNumber?: string;
    address?: string;
    gender?: GENDER;
    sortBy?: string;
 }