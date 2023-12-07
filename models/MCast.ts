class MCast {
  character?: string;
  id?: string;
  personId?: string;
  mediaId?: string;

  constructor({
    id,
    character,
    mediaId,
    personId
  }: {
    id?: string;
    character?: string;
    mediaId?: string;
    personId?: string;
  }) {
    this.character = character;
    this.id = id;
    this.personId = personId
    this.mediaId = mediaId
  }
}

export default MCast;
