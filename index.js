var i = 0;

$.getJSON("./data.json", function ({ info, item: items }) {
  $("#title").text(info.name);
  $("#api-description").text(info.description);
  items.forEach(({ item, name, request, description }) => {
    if (item) {
      createSection(item, name, true, description);
    } else {
      createRequest(request, name);
    }
  });
});

function createSection(items, sectionName, isTopLevel, description) {
  $("#items").append(
    `<h${isTopLevel ? "5" : "6"} class="mt-3">${sectionName}</h5>
      <span class="card-text">
        ${marked(
          description ||
            '_<span class="text-muted">No description provided</span>_'
        )}
      </span>`
  );
  items.forEach(({ item, name, request }) => {
    if (item) {
      createSection(item, name, false);
    } else {
      createRequest(request, name);
    }
  });
}

function createRequest(
  { method, url: { path }, header, body, description },
  name
) {
  const url = createURL(path);
  const headers = createHeaderRows(header);
  try {
    $("#items").append(`
    <div class="card">
      <div class="card-header">
      ${name}
      <button class="btn btn-secondary" data-toggle="collapse" data-target="#collapse${i}">Collapse</button>
    </div>
    <div id="collapse${i++}" class="card-body collapse show">
      <code class="code mb-1">
        ${createMethodLabel(method)} ${url}
      </code>
      <div class="mt-4">
        <p class="card-text">
        ${marked(
          description ||
            '_<span class="text-muted">No description provided</span>_'
        )}
        </p>
      </div>
      ${getHeadersTable(headers)}
      ${createPostBody(body, method)}
    </div>
      `);
  } catch (error) {}
}

function getHeadersTable(headers) {
  if (headers?.length > 0)
    return `
      <table 
      class="table table-striped table-bordered table-hover headers"
      >
      <caption class="caption-top">HEADERS</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          ${headers}
        </tbody>
      </table>
    `;
  return "";
}

function createMethodLabel(method) {
  return `
  <span class="method" style="background-color:${getColor(
    method
  )}">${method}</span>
  `;
}

function createPostBody(postBody, method) {
  if (!["POST"].includes(method) || postBody.mode !== "raw") return "";

  const data = Prism.highlight(
    postBody[postBody.mode],
    Prism.languages.javascript,
    "javascript"
  );

  return createJsonBody(postBody.options[postBody.mode].language, data);
}

function createJsonBody(language, data) {
  return (
    '<div class="text-muted">EXAMPLE REQUEST BODY</div>' +
    '<pre class="language-javascript">' +
    '<div class="language shadow rounded mb-3">' +
    language.toUpperCase() +
    "</div>" +
    `<code class="language-javascript">${data}</code></pre>`
  );
}

function createHeaderRows(headers) {
  return headers?.map(
    ({ key, value }) => `
    <tr>
      <td>${key}</td>
      <td>${value}</td>
    </tr>
    `
  );
}

function createURL(parts) {
  return parts.reduce((url, part) => {
    if (!part.trim()) return url;
    if (/[0-9]+/.test(part)) return (url += ":id/");
    return (url += part + "/");
  }, "/");
}

function getColor(method) {
  switch (method.toLowerCase()) {
    case "get":
      return `green`;
    case "post":
      return `orange`;
    case "put":
      return `blue`;
    case "delete":
      return `red`;
    default:
      return `blue`;
  }
}
