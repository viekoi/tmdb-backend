class MGenre {
  name?: string;
  id?:string
  genreIds?:string[]
  constructor({ id, name,genreIds }: { id?: string, name?: string,genreIds?:string[] }) {
    this.name = name;
    this.id = id
    this.genreIds = genreIds
  }
}

export default MGenre;
