export interface IPageInterface<DATA> {
  page: number;
  limit: number;
  itemsFound: number;
  data: DATA[];
}

//тимчасова
export interface IPageData<DATA> {
  data: DATA[];
}
