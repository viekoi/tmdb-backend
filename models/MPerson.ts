class MPerson {
  id?: string;
  fullName?: string;
  biography?: string;
  knownFor?: string;
  dob?: string;
  pob?: string;
  gender?: string;
  imageUrl?: string;
  peopleIds?:string[]


  constructor({
    id,
    fullName,
    biography,
    knownFor,
    dob,
    pob,
    gender,
    imageUrl,
    peopleIds,
  }: {
    id?: string;
    fullName?: string;
    biography?: string;
    knownFor?: string;
    dob?: string;
    pob?: string;
    gender?: string;
    imageUrl?: string;
    peopleIds?:string[]
  }) {
    this.id = id;
    this.fullName = fullName;
    this.biography = biography;
    this.knownFor = knownFor;
    this.dob = dob;
    this.pob = pob;
    this.gender = gender;
    this.imageUrl = imageUrl;
    this.peopleIds = peopleIds
  }
}

export default MPerson;
