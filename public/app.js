import { webhooks } from "./components.js";

const apiURLInput = document.getElementById("api-url-input");

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};

document.addEventListener("submit", (e) => {
  e.preventDefault();

  const formId = parseInt(e.target.id.split("form-")[1]);
  const data = serializeForm(e.target);
  const webhook = webhooks[formId];
  const statusBox = document.getElementById(`status-box-${formId}`);

  const API_URL = apiURLInput.value;

  if (!API_URL) {
    alert("Missing API url");
    return;
  }

  if (!API_URL.includes("http")) {
    alert("Invalid API url");
    return;
  }

  fetch(API_URL + webhook.endpoint, {
    method: webhook.method,
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then(async (res) => {
    const payload = await res.json();
    if (res.ok) {
      statusBox.innerHTML = `<div class="text-green-500 font-bold">${res.status}</div> <div class="text-green-500">Success!</div>`;
      e.target.reset();
      return;
    }

    statusBox.innerHTML = `<div class="text-red-700 font-bold">${res.status}</div> <div class="text-red-700 text-sm">${payload.error.message}</div>`;
  });
});
