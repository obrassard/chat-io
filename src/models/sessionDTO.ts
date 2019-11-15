export class SessionDto {
    public identifier: string;
    public secret: string;
    public user: string; //uid

    public constructor(init: SessionDto) {
        this.identifier = init.identifier;
        this.secret = init.secret;
        this.user = init.user;
    }
}