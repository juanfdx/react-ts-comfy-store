/* 
* the pagination must maintain the current url params set by filters, because pagination
* is subrogate from the url, so the only thing pagination does is to add page number to 
* the current url, all other params are kept the same
*/

type ConstructUrlParams = {
  pageNumber: number;
  search: string;
  pathname: string;
}

// construct the url adding page number to , search, and pathname
export const constructUrl = ({pageNumber, search, pathname}: ConstructUrlParams): string => {
  const searchParams = new URLSearchParams(search);
  searchParams.set('page', pageNumber.toString());
  
  return `${pathname}?${searchParams.toString()}`
}



type ConstructPrevOrNextParams = { 
  currentPage: number;
  pageCount: number;
  search: string;
  pathname: string;
}

export const constructPrevOrNextUrl = ({
  currentPage, pageCount ,search, pathname
}: ConstructPrevOrNextParams): {prevUrl: string; nextUrl: string} => {

  let prevPage = currentPage - 1;
  if (prevPage < 1) prevPage = 1;

  const prevUrl = constructUrl({pageNumber: prevPage, search, pathname});

  let nextPage = currentPage + 1;
  if (nextPage > pageCount) nextPage = pageCount
    
  const nextUrl = constructUrl({pageNumber: nextPage, search, pathname});

  return {prevUrl, nextUrl};
}