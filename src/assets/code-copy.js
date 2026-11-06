document.querySelectorAll(".prose pre > code").forEach((code) => {
  const pre = code.parentElement;
  const wrapper = document.createElement("div");
  wrapper.className = "code-block";
  const status = document.createElement("span");
  status.className = "code-copy-status";
  status.setAttribute("role", "status");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy-button";
  button.setAttribute("aria-label", "コードをコピー");
  button.title = "コードをコピー";
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("width", "18");
  icon.setAttribute("height", "18");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.7");
  icon.setAttribute("aria-hidden", "true");
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const copyPath = "M9 5V3h12v12h-2M3 9h12v12H3Z";
  shape.setAttribute("d", copyPath);
  icon.append(shape);
  button.append(icon);
  pre.before(wrapper);
  wrapper.append(button, pre, status);
  let resetTimer;

  button.addEventListener("click", async () => {
    button.disabled = true;
    clearTimeout(resetTimer);
    wrapper.classList.remove("copy-error", "copy-success");
    shape.setAttribute("d", copyPath);
    status.textContent = "";
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable");
      }
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = "コピーしました";
      wrapper.classList.add("copy-success");
      shape.setAttribute("d", "m5 12 4 4L19 6");
      button.title = "コピーしました";
      resetTimer = setTimeout(() => {
        wrapper.classList.remove("copy-success");
        shape.setAttribute("d", copyPath);
        button.title = "コードをコピー";
        status.textContent = "";
      }, 2000);
    } catch (error) {
      console.error("コードのコピーに失敗しました。", error);
      status.textContent = "コピーできませんでした。コードを選択して手動でコピーしてください。";
      wrapper.classList.add("copy-error");
      button.title = "コピーを再試行";
    } finally {
      button.disabled = false;
    }
  });
});
