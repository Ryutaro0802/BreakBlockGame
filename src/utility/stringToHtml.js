export function stringToHtml(htmlString) {
  const templateElement = document.createElement("template");
  templateElement.innerHTML = htmlString;
  return templateElement.content.firstElementChild;
}
