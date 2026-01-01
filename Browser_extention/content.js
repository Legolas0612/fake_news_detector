function extractPageData() {
  return {
    url: window.location.href,
    domain: window.location.hostname,
    title: document.title || "",
    author:
      document.querySelector('meta[name="author"]')?.content ||
      document.querySelector('[rel="author"]')?.innerText ||
      "",
    publish_date:
      document.querySelector('meta[property="article:published_time"]')?.content ||
      document.querySelector('time')?.dateTime ||
      "",
    language: document.documentElement.lang || "",
    main_text: extractMainText(),
    raw_html_length: document.documentElement.innerHTML.length
  };
}

function extractMainText() {
  const article =
    document.querySelector("article") ||
    document.querySelector("main");

  if (!article) {
    return document.body.innerText;
  }

  return article.innerText;
}

// Send to background
chrome.runtime.sendMessage({
  type: "PAGE_DATA",
  payload: extractPageData()
});
