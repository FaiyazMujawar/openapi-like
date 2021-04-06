var i = 0;
var count = 0;
// Make it collapse

$.getJSON("./data.json", function ({ info, item: items, variable }) {
  // Set the Collection name
  $("#title").text(info.name);

  const server = variable.find(({ key }) => key === "server");
  $("#server").append(
    `<div>
      <b>Base URL: </b>
      ${
        server?.value ||
        getInfoText(
          "Please define a variable 'server in your Postman collection'"
        )
      }
    </div>
    <hr/>
    `
  );

  // Set the API description
  $("#api-description").append(
    marked(info.description || getInfoText("No description provided"))
  );
  $("#api-description pre code").each(function () {
    $(this).html(highlightCode($(this).html()));
  });

  items.forEach(({ item, name, request, description, response }) => {
    if (item) {
      createSection(item, name, true, description);
    } else {
      createRequest(request, name, response[0]);
    }
  });

  $("pre, pre code").addClass("language-javascript");
  $(".card-text pre code").each(function () {
    $(this).html(highlightCode($(this).html()));
  });
});

function createSection(items, sectionName, isTopLevel, description) {
  $("#items").append(
    `<h${isTopLevel ? "5" : "6"} class="mt-3">${sectionName}</h5>
      <span class="card-text">
        ${marked(description || getInfoText("No description provided"))}
      </span>`
  );
  items.forEach(({ item, name, request, description, response }) => {
    if (item) {
      createSection(item, name, false, description);
    } else {
      createRequest(request, name, response[0]);
    }
  });
}

function createRequest(
  { method, url: { path }, header, body, description },
  name,
  response
) {
  const url = createURL(path);
  const headers = createHeaderRows(header);
  try {
    $("#items").append(`
    <div class="card">
      <div class="card-header">
      ${name}
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
      ${
        ["POST"].includes(method)
          ? `<div class="request">
          ${createPostBody(body)}  
          ${createResponseBody(response)}
        </div>`
          : ""
      }
    </div>
      `);
  } catch (error) {
    console.log({ name, count: count++, error: error.message });
  }
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

function createPostBody(postBody) {
  const data = highlightCode(postBody[postBody.mode]);

  return createJsonBody(postBody.options[postBody.mode].language, data);
}

function createJsonBody(language, data) {
  return (
    "<div>" +
    '<div class="text-muted">EXAMPLE REQUEST BODY</div>' +
    "<pre>" +
    '<div class="language shadow rounded mb-3">' +
    language.toUpperCase() +
    "</div>" +
    `<code">${data}</code></pre>` +
    "</div>"
  );
}

function createResponseBody(response) {
  if (!response)
    return (
      "<div>" +
      `<div class="text-muted">EXAMPLE RESPONSE BODY</div>` +
      `<pre>` +
      `<code>${highlightCode("No response found")}</code></pre>` +
      "</div>"
    );
  const { code, status, body } = response;
  return (
    "<div>" +
    `<div class="text-muted">EXAMPLE RESPONSE BODY</div>` +
    `<pre><div class="mb-3">status: ${code} ${status}</div>` +
    `<code>${highlightCode(body || "No response found")}</code></pre>` +
    "</div>"
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

const highlightCode = (code) =>
  Prism.highlight(code, Prism.languages.javascript, "javascript");

const getInfoText = (text) => `_<span class="text-muted">${text}</span>_`;

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
