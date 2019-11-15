import { Session } from './session';
import { StringUtilities } from './stringsUtilies';

export class SessionDataStore {

  private static dataStore:any = {};

  public static createSession(userDefinedPassword:string){
    let identifier = SessionDataStore.generateUId();
    let session = new Session(identifier, userDefinedPassword);
    SessionDataStore.dataStore[identifier] = session;
    return session;
  }

  public static getSessionById(identifier: string): Session | null{
    if (SessionDataStore.dataStore.hasOwnProperty(identifier))
      return SessionDataStore.dataStore[identifier];
    else 
      return null;
  }

  public static destroySesssion(identifier: string):void{
    delete SessionDataStore.dataStore[identifier];
  }

  private static generateUId() : string{    
    let identifier:string;
    do {
      identifier = SessionDataStore.generateId();
    } while (SessionDataStore.dataStore.hasOwnProperty(identifier))
    return identifier;
  }

  private static generateId(): string {
    let id:string = "";
    for (let i=0; i< 3; i++){
      let num = StringUtilities.pad3(Math.floor(Math.random() * 999));
      if (i == 0){
        id += num;
      } else {
        id += `-${num}`
      }
    }
    return id;
  }
}

