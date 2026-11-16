const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const output = path.resolve("_site");
const files = fs.readdirSync(output, { recursive: true })
  .filter((name) => name.endsWith(".html"));
const sourceModules = fs.readdirSync(path.resolve("src", "modules"))
  .filter((name) => name.endsWith(".md"));

test("generates an agenda and every module", () => {
  assert.equal(files.length, sourceModules.length + 2);
  const home = fs.readFileSync(path.join(output, "index.html"), "utf8");
  assert.match(home, /アジェンダ/);
  assert.equal((home.match(/class="agenda-card"/g) || []).length, sourceModules.length);
  assert.equal((home.match(/class="agenda-time"/g) || []).length, sourceModules.length);
  assert.equal((home.match(/class="card-badges"/g) || []).length, sourceModules.length);
  assert.doesNotMatch(home, /role="tab"/);
});

test("agenda matches the eight Excel lab blocks and their timings", () => {
  const expected = [
    ["01-agent-components", "10:15", "45分", "30分"],
    ["02-skills", "11:10", "50分", "40分"],
    ["03-knowledge-tools", "13:00", "50分", "35分"],
    ["04-multi-agent", "13:50", "15分", null],
    ["05-natural-language", "14:05", "30分", "20分"],
    ["06-evaluation", "14:35", "30分", "20分"],
    ["07-workflows", "15:05", "40分", "25分"],
    ["08-cost-monitoring", "15:55", "15分", "5分"]
  ];
  assert.deepEqual(sourceModules.slice().sort(), expected.map(([slug]) => `${slug}.md`));
  const home = fs.readFileSync(path.join(output, "index.html"), "utf8");
  const cards = [...home.matchAll(/<a class="agenda-card"[\s\S]*?<\/a>/g)].map(([card]) => card);
  assert.equal(cards.length, expected.length);
  expected.forEach(([slug, time, duration, labDuration], index) => {
    assert.ok(cards[index].includes(`/modules/${slug}/`));
    assert.ok(cards[index].includes(time));
    assert.ok(cards[index].includes(`全体 ${duration}`));
    if (labDuration) {
      assert.ok(cards[index].includes(`Lab ${labDuration}`));
    } else {
      assert.doesNotMatch(cards[index], /Lab /);
    }
  });
});

test("local links and assets resolve under the configured Pages subpath", () => {
  const prefix = process.env.PATH_PREFIX || "/";
  for (const file of files) {
    const html = fs.readFileSync(path.join(output, file), "utf8");
    assert.match(html, /<html lang="ja">/);
    for (const [, attribute] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(attribute)) continue;
      const [urlPath, fragment] = attribute.split("#");
      let target;
      if (urlPath.startsWith("/")) {
        assert.ok(urlPath.startsWith(prefix), `${file}: missing prefix in ${attribute}`);
        target = path.join(output, decodeURIComponent(urlPath.slice(prefix.length)));
      } else {
        target = path.resolve(path.dirname(path.join(output, file)), decodeURIComponent(urlPath));
      }
      assert.ok(fs.existsSync(target), `${file}: unresolved ${attribute}`);
      if (fs.statSync(target).isDirectory()) target = path.join(target, "index.html");
      assert.ok(fs.existsSync(target), `${file}: unresolved index ${attribute}`);
      if (fragment) {
        const destination = fs.readFileSync(target, "utf8");
        assert.ok(destination.includes(`id="${decodeURIComponent(fragment)}"`), `${file}: missing fragment ${attribute}`);
      }
    }
  }
});

test("module pages contain active navigation and neighboring page links", () => {
  for (const file of files.filter((name) => name.startsWith(`modules${path.sep}`))) {
    const html = fs.readFileSync(path.join(output, file), "utf8");
    assert.equal((html.match(/<a\b[^>]*aria-current="page"/g) || []).length, 1);
    assert.match(html, /aria-label="前後のモジュール"/);
    assert.match(html, /<details class="module-selector">/);
    assert.match(html, /aria-label="現在位置"/);
    assert.match(html, /<article class="prose"/);
    assert.doesNotMatch(html, /\{\{|\{%/);
  }
});

test("outlines end in summary and references without removed sections", () => {
  const sources = ["HANDSON-TEMPLATE.md", ...sourceModules.map((file) => path.join("src", "modules", file))];
  for (const source of sources) {
    const text = fs.readFileSync(source, "utf8");
    const headings = [...text.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading);
    assert.deepEqual(headings.slice(-2), ["まとめ", "参考情報"], source);
    assert.ok(!headings.some((heading) =>
      /完了確認|トラブルシューティング|後片付け|次のステップ/.test(heading)), source);
  }
});

test("authoring page renders samples independently of the lab agenda", () => {
  const html = fs.readFileSync(path.join(output, "authoring", "samples", "index.html"), "utf8");
  for (const type of ["note", "tip", "important", "warning"]) {
    assert.ok(html.includes(`class="callout callout-${type}"`));
  }
  assert.match(html, /<pre><code class="language-python">/);
  assert.ok(html.includes("sample_values = [10, 20, 30]"));
  assert.doesNotMatch(html, /<p>\[!(NOTE|TIP|IMPORTANT|WARNING)\]/);
  assert.match(html, /<strong>同じプロンプト<\/strong>/);
  assert.match(html, /<img src="..\/..\/assets\/images\/agent-flow-sample.svg" alt="入力・エージェント・出力の流れを示すサンプル図"/);
  assert.doesNotMatch(html, /class="page-navigation"|class="module-selector"/);
  const home = fs.readFileSync(path.join(output, "index.html"), "utf8");
  assert.doesNotMatch(home, /authoring\/samples/);
  const firstModule = fs.readFileSync(path.join(output, "modules", "01-agent-components", "index.html"), "utf8");
  assert.doesNotMatch(firstModule, /agent-flow-sample|sample_values|補足欄・コードスニペット/);
});

test("Markdown alerts preserve formatting, lists and ordinary quotations", () => {
  let markdown;
  require("../.eleventy.js")({
    setLibrary: (_, library) => { markdown = library; },
    addPassthroughCopy() {},
    addCollection() {},
    addFilter() {}
  });
  const html = markdown.render("> [!TIP]\n> **Hint** and `code`\n>\n> - first\n> - second\n\n> Ordinary quote\n");
  assert.match(html, /class="callout callout-tip"/);
  assert.match(html, /<strong>Hint<\/strong> and <code>code<\/code>/);
  assert.match(html, /<li>first<\/li>/);
  assert.match(html, /<blockquote>\n<p>Ordinary quote<\/p>/);
  assert.doesNotMatch(markdown.render("```text\n> [!TIP]\n```"), /class="callout/);
});
