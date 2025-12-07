const api = typeof browser !== "undefined" ? browser : chrome;

// api.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "GET_DATA") {
//     // Tu odpalasz fetch do swojego backendu
//     fetch("https://twoje-api.pl/api/status", {
//       method: "GET",
//       headers: {
//         "Accept": "application/json"
//         // ew. Authorization: "Bearer XYZ"
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         sendResponse({ data });
//       })
//       .catch(err => {
//         console.error(err);
//         sendResponse({ error: String(err) });
//       });

//     // ważne w MV3: mówimy że odpowiedź będzie async
//     return true;
//   }
// });

