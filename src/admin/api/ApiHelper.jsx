import API from './Api';
export const getAll = (endpoint) => API.get(endpoint);
export const getById = (id, endpoint) => API.get(`${endpoint}/${id}`);
export const create = (data, endpoint) => API.post(endpoint, data);
export const update = (id, endpoint, data) => API.put(`${endpoint}/${id}`, data);
export const update_patch = (id, endpoint, data) => API.patch(`${endpoint}/${id}`, data);
export const update_patch_no_id = (endpoint, data) => API.patch(endpoint, data);  
export const deActive = (id, endpoint) => API.delete(`${endpoint}${id}`);
export const deactive = (id, endpoint) => API.delete(`${endpoint}/${id}`);
export const updateHelper = (id, endpoint, data) => API.put(`${endpoint}${id}`, data);


export const deleteWithQueryParams = (endpoint, queryParams) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${endpoint}?${queryString}`;
  return API.delete(url);
};

// PATCH with query params
  export const patchWithQueryParams = (endpoint, queryParams) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = `${endpoint}?${queryString}`;
    return API.patch(url);
  };

//UPDATE WITH QUERY PARAMS
export const updateWithQueryParams = (queryParams, endpoint, data) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${endpoint}?${queryString}`;
  return API.put(url, data);
};
//GET THE DATA BY AND ID AND DATA(ONLY NEEDED DATA)
export const getByIdAndType = (id,type, endpoint) => API.get(`${endpoint}/${id}/${type}`);

//EDIT API FUNCTION ONLY BY REQUEST BODY 
export const editWithReqBody = ( endpoint,requestBody) => API.put(`${endpoint}`,requestBody);

//GET METHOD WITH QUERY PARAM 
export const getWithQueryParam=(endpoint,reqQuery)=> {
  const queryString = new URLSearchParams(reqQuery).toString();
 return API.get(`${endpoint}?${queryString}`)
}