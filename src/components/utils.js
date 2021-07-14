const serverUrl = "http://localhost:4000";

const headers = {
  "Content-Type": "application/json",
};

const request = async (url, type, body) => {
  let response;
  if (type == "GET" | type=="DELETE") {
    response = await fetch(`${serverUrl}${url}`, {
      method: type,
      headers: headers,
    });
  } else {
    response = await fetch(`${serverUrl}${url}`, {
      method: type,
      headers: headers,
      body: JSON.stringify((body == null) | (body == undefined) ? {} : body),
    });
  }

  if (type == "DELETE" || type == "PATCH" || type =="GET") {
    return response;
  }
  return response.json();
};

export default request;
