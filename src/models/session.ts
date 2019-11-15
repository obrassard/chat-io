import { sha256 } from 'js-sha256';
import crypto from 'crypto';
import { User } from './users';

export class Session {
    identifier: string;
    hash: any;
    secret: string;
    users: any;
    
    constructor(identifier:string, password:string){
        this.identifier = identifier;
        this.hash = sha256(password);
        this.secret = crypto.randomBytes(64).toString('hex');
        this.users = {};
    }

    //return userid
    public addUser(name:string, email:string) : string {
        let users : User[] = Object.values(this.users);
        let emailExist = users.map(u =>  u.email).some(e=> e == email);
        if (emailExist){
            throw new Error(email);
        }

        let id:string; 
        do {
            id = crypto.randomBytes(64).toString('hex');
        } while (this.users.hasOwnProperty(id))

        this.users[id] = new User(name,email,id);
        return id;
    }

    public getUser(id: string) : User {
        if (!this.users.hasOwnProperty(id)){
            throw new Error('User not found');
        }
        return this.users[id] ;
    }

    public hasUser(uid: string) : boolean {
        return this.users.hasOwnProperty(uid);
    }

    // Return the size of the user object after deletion
    public removeUser(id: string) : number {
        if (!this.users.hasOwnProperty(id)){
            throw new Error('User not found');
        }
        delete this.users[id]
        return Object.keys(this.users).length;
    }
}

