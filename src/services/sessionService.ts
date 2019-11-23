import { SessionDataStore } from "../models/sessionDataStore";
import { Session } from "../models/session";
import { SessionDto } from "../models/sessionDTO";
import { sha256 } from "js-sha256";

export class SessionService {
    public createSession(password: string, userName: string, userEmail: string): SessionDto{
        let session : Session = SessionDataStore.createSession(password);
        let userId = session.addUser(userName, userEmail);
        
        return new SessionDto({identifier: session.identifier, secret: session.secret, user: userId})
    }

    public joinSession(identifier: string, password: string, userName: string, userEmail: string): SessionDto{
        let session = SessionDataStore.getSessionById(identifier);

        if (session == null) {
            throw 'Expired session';
        }

        if (sha256(password) != session.hash ){
            throw 'Invalid password';
        }

        // Can throw error if email exist for this session
        let userId = session.addUser(userName, userEmail);
        
        return new SessionDto({identifier: session.identifier, secret: session.secret, user: userId})
    }

    public leaveSession(identifier: string, userId: string): void{
        
        let session = SessionDataStore.getSessionById(identifier);

        if (session == null) {
            throw 'Expired session';
        }

        let ucount = session.removeUser(userId);
        if (ucount == 0) {
            SessionDataStore.destroySesssion(identifier);
        }
    }

    // public 
}