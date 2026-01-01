const NATIVE_HOST_NAME = "fakenews_backend";

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "PAGE_DATA") {
    const json = normalizeData(message.payload);
    sendToBackend(json);
  }
});

function normalizeData(data) {
  return {
    protocol_version: 1,
    source: "browser_extension",
    timestamp: new Date().toISOString(),

    article: {
      url: data.url,
      domain: data.domain,
      title: data.title.trim(),
      author: data.author.trim(),
      publish_date: data.publish_date,
      language: data.language || "unknown",
      main_text: data.main_text.slice(0, 50_000)
    },

    claims: [],
    entities: [],
    metadata: {
      raw_html_length: data.raw_html_length
    }
  };
}

function sendToBackend(json) {
  chrome.runtime.sendNativeMessage(
    NATIVE_HOST_NAME,
    json,
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Native messaging error:", chrome.runtime.lastError.message);
        return;
      }

      console.log("Backend response:", response);
    }
  );
}
