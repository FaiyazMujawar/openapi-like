$.getJSON("./data.json", function ({ info, item: items }) {
  $("#title").text(info.name);
  $("#api-description").text(info.description);
  items.forEach((item) => {
    if (item.item) {
      createSection(item.item, item.name);
    } else {
      createRequest(item.request, item.name);
    }
  });
});

function createSection(items, name) {
  items.forEach((item) => {
    if (item.item) {
      $("#items").append(`<h5 class="mt-3 mb-3">${name}</h5>`);
      createSection(item.item, item.name);
      $("#items").append("<hr />");
    } else {
      createRequest(item.request, item.name);
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
    </div>
    <div class="card-body">
      <code class="code mb-1">
        ${createMethodLabel(method)} ${url}
      </code>
      <div class="mt-4">
        <p class="card-text">
          ${description || ""}
        </p>
      </div>
      ${getHeadersTable(headers)}
      ${createPostBody(body, method)}
    </div>
      `);
    Prism.highlightElement($(this));
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

  return `<pre class="language-javascript"><code class="language-javascript">${data}</code></pre>`;
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

// const body = postBody[postBody["mode"]];
//   /* .replace(/^\n\s+/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
//     .replace(/\n/, "<br/>"); */

//     console.log(body);

//     return `
//       <div class="text-muted">REQUEST BODY</div>
//       <pre class="code language-json mt-2">
//       <div class="language code shadow rounded m-0">${postBody.options[
//         postBody.mode
//       ].language.toUpperCase()}</div>
//       <code class="language-json">
//         \n${body}
//       </code>
//       </pre>
//     `;
