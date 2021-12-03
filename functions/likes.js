// export const onRequest = () => {
//   // Generate unique DO for each path
//   let path = new URL(request.url).pathname.split("/")[1];
//   let operation = new URL(request.url).pathname.split("/")[2] || "/";

//   let id = env.COUNTER.idFromName(path);
//   let obj = env.COUNTER.get(id);

//   let resp = await obj.fetch(request.url, {
//     method: "POST",
//     body: JSON.stringify({
//       url: request.url,
//       path: path,
//       operation: operation,
//     }),
//   });

//   let count = await resp.text();

//   return new Response(count);
// };

export const onRequest = () => {
  return new Response(new Date().toISOString());
};
