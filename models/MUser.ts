class MUser {
  id?: string;
  userName?: string;
  password?: string;
  token?:string
  constructor({
    id,
    userName,
    password,
    token
  }: {
    id?: string;
    userName?: string;
    password?: string;
    token?:string
  }) {
    this.id = id;
    this.userName = userName;
    this.password = password;
    this.token = token
  }
}

export default MUser;
