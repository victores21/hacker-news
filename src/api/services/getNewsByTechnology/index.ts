interface TechNewsResponse {
  hits: Array<any>;
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  exhaustive: object;
  query: string;
  params: string;
  processingTimeMS: number;
  processingTimingsMS: object;
}

export const getNewsByTechnology = async (
  technology: string = "angular",
  page: number = 0
): Promise<TechNewsResponse> => {
  try {
    const req = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${technology}&page=${page}`
    );
    const res = await req.json();

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};
