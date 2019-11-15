export class User{
    id: string;
    name: string;
    email: string;

    constructor(name:string, email:string, id:string) {
        this.name = name;
        this.email = email;
        this.id = id;
    }
}