document
  .querySelectorAll("code")
  .forEach((element) =>
    element.addEventListener("click", () =>
      navigator.clipboard.writeText(element.textContent)
    )
  );
