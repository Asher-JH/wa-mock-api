const webhooksContainer = document.getElementById("web-hooks");

const webhooks = [
  {
    method: "POST",
    title: "Add WhatsApp Instance",
    endpoint: "/trpc/hook.addWhatsappInstance",
    fields: [
      {
        name: "instanceHash",
        placeholder: "000abc2344",
        label: "Instance Hash",
      },
      {
        name: "hostURL",
        placeholder: "http://wa-instance.com",
        label: "Host URL",
      },
      {
        name: "accessToken",
        placeholder: "burrito-taco",
        label: "Access Token",
      },
    ],
    onSubmit(data) {},
  },
  {
    method: "POST",
    title: "QR Scan Completed",
    endpoint: "/trpc/hook.scanCompleted",
    fields: [
      {
        name: "instanceHash",
        placeholder: "000abc2344",
        label: "Instance Hash",
      },
      {
        name: "deviceNumber",
        placeholder: "60123456789",
        label: "Device Number",
      },
    ],
  },
];

function createWebhookTitle(method, title, endpoint) {
  return `
    <div class="border border-1 rounded-lg w-full p-2 mb-2 mt-4">
        <div class="flex flex-row justify-start items-center">
            <div class="p-1 px-2 text-sm text-bold text-white bg-green-500 rounded-lg mr-6">
            ${method}
            </div>
            <div class="text-sm mr-6">${title}</div>
            <div class="text-sm font-bold text-gray-700">
                ${endpoint}
            </div>
        </div>
    </div>
  `;
}

function createField(label, name, placeholder, isFirst) {
  return `
    <div class="flex flex-row ${!isFirst ? "mt-4" : ""}">
        <label class="w-[140px] text-sm font-bold text-gray-700 flex flex-row justify-between items-center mr-6" for="instanceHash">
            ${label} <span>:</span>
        </label>
        <input 
            id="${name}" 
            name="${name}" 
            type="text"
            class="text-sm border border-1 w-[300px] border-gray-400 p-1 rounded-md"
            required
            placeholder="${placeholder}"
        />
    </div>
  `;
}

function createForm(id, fields) {
  const fieldsHTML = fields
    .map((f, idx) => createField(f.label, f.name, f.placeholder, idx === 0))
    .join("");

  return `
    <div class="border border-1 rounded-lg w-full p-2">
        <form id="form-${id}" class="w-full flex flex-row justify-start items-center">
            <div>
                ${fieldsHTML}
            </div>

            <button id="btn-${id}" type="submit" class="font-light text-sm text-white bg-green-500 hover:bg-green-100 py-1 px-4 rounded-md ml-auto mt-auto">
                Send
            </button>
        </form>
    </div>
    `;
}

// Generate
const webhooksHTML = webhooks
  .map((wh, idx) => {
    const title = createWebhookTitle(wh.method, wh.title, wh.endpoint);
    const form = createForm(idx, wh.fields);

    return title + form;
  })
  .join("");

// Insert into HTML
webhooksContainer.innerHTML = webhooksHTML;
