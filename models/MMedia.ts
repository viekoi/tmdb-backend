

class MMedia {
  id?: string;
  title?: string;
  imageUrl?: string;
  backDropImageUrl?: string;
  originalLanguage?: string;
  trailerUrl?: string;
  runTime?: string;
  overview?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  directorId?: string;
  releasedDay?: Date;
  genreIds?: string[];
  mediaIds?: string[];
  releasedDayStart?: Date;
  releasedDayEnd?: Date;
  pageNumber?: number;
  pageSize?: number;

  constructor({
    id,
    title,
    imageUrl,
    backDropImageUrl,
    originalLanguage,
    trailerUrl,
    runTime,
    overview,
    budget,
    revenue,
    status,
    directorId,
    releasedDay,
    genreIds,
    mediaIds,
    releasedDayStart,
    releasedDayEnd,
    pageNumber,
    pageSize,
  }: {
    id?: string;
    title?: string;
    imageUrl?: string;
    backDropImageUrl?: string;
    originalLanguage?: string;
    trailerUrl?: string;
    runTime?: string;
    overview?: string;
    budget?: number;
    revenue?: number;
    status?: string;
    directorId?: string;
    releasedDay?: Date;
    genreIds?: string[];
    mediaIds?: string[];
    releasedDayStart?: Date;
    releasedDayEnd?: Date;
    pageNumber?: number;
    pageSize?: number;
  }) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.backDropImageUrl = backDropImageUrl;
    this.originalLanguage = originalLanguage;
    this.trailerUrl = trailerUrl;
    this.runTime = runTime;
    this.overview = overview;
    this.budget = budget;
    this.revenue = revenue;
    this.status = status;
    this.directorId = directorId;
    this.releasedDay = releasedDay;
    this.genreIds = genreIds;
    this.mediaIds = mediaIds;
    this.releasedDayStart = releasedDayStart;
    this.releasedDayEnd = releasedDayEnd;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
  }
}

export default MMedia;
