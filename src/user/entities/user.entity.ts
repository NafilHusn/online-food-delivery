import { Role } from '../constants/role.enum';
import { Country } from '../constants/country.enum';

export class UserEntity {
    id: string; // UUID
    name: string;
    email: string;
    password?: string; // Optional so we can hide it in responses
    role: Role;
    country: Country;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
        // Ensure password is not exposed in the response
        delete this.password;
    }
}
