export function load(route) {
  return axios
    .get("https://jsonplaceholder.typicode.com"+route, {
      withCredentials: true,
      responseType: "",
    })
    .then((response) => response)
    .catch((error) => console.error(error));
}
