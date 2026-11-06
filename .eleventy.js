const markdownIt = require("markdown-it");

module.exports = function (config) {
  const markdown = markdownIt({ html: true });
  const labels = { NOTE: "Note", TIP: "Tip", IMPORTANT: "Important", WARNING: "Warning" };
  markdown.renderer.rules.blockquote_open = (tokens, index, options, env, renderer) => {
    const inline = tokens[index + 2];
    const match = tokens[index + 1]?.type === "paragraph_open" && inline?.type === "inline"
      ? inline.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING)\](?:\n|$)/)
      : null;
    if (!match) return renderer.renderToken(tokens, index, options);
    const type = match[1];
    tokens[index].attrSet("class", `callout callout-${type.toLowerCase()}`);
    tokens[index].attrSet("aria-label", labels[type]);
    inline.content = inline.content.slice(match[0].length);
    inline.children = [];
    markdown.inline.parse(inline.content, markdown, env, inline.children);
    return renderer.renderToken(tokens, index, options)
      + `<p class="callout-title">${labels[type]}</p>\n`;
  };
  config.setLibrary("md", markdown);
  config.addPassthroughCopy("src/assets");
  config.addCollection("modules", (collection) =>
    collection.getFilteredByGlob("src/modules/*.md")
      .sort((a, b) => a.data.order - b.data.order)
  );
  config.addFilter("moduleIndex", (modules, url) =>
    modules.findIndex((module) => module.url === url)
  );
  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: "src", output: "_site", includes: "_includes" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false
  };
};
