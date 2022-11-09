import { webhooks } from "./components.js";

const apiURLInput = document.getElementById("api-url-input");
const secretInput = document.getElementById("secret-input");

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};

document.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formId = parseInt(e.target.id.split("form-")[1]);
  const data = serializeForm(e.target);
  const webhook = webhooks[formId];
  const statusBox = document.getElementById(`status-box-${formId}`);

  const API_URL = apiURLInput.value;
  const SECRET = secretInput.value;

  if (!API_URL) {
    alert("Missing API url");
    return;
  }

  if (!API_URL.includes("http")) {
    alert("Invalid API url");
    return;
  }

  let signature = null;

  const signatureRes = await fetch("/api/generateSignature", {
    method: "POST",
    body: JSON.stringify({ ...data, secret: SECRET }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (!signatureRes.ok) {
    statusBox.innerHTML = `<div class="text-red-700 text-sm">Failed to generate signature</div>`;
    return;
  }

  if (signatureRes.ok) {
    const payload = await signatureRes.json();
    signature = payload;
  }

  fetch(API_URL + webhook.endpoint, {
    method: webhook.method,
    body: JSON.stringify(data),
    headers: {
      "x-signature-sha256": signature,
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(async (res) => {
      const payload = await res.json();
      if (res.ok) {
        statusBox.innerHTML = `<div class="text-green-500 font-bold">${res.status}</div> <div class="text-green-500">Success!</div>`;
        e.target.reset();
        return;
      }

      statusBox.innerHTML = `<div class="text-red-700 font-bold">${res.status}</div> <div class="text-red-700 text-sm">${payload.error.message}</div>`;
    })
    .catch((err) => {
      console.log(err);
      statusBox.innerHTML = `<div class="text-red-700 text-sm">Failed to fetch</div>`;
    });
});
