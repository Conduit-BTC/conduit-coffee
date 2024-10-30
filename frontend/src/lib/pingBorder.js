export default function pingBorder(element, pingColor) {
  element.classList.add(pingColor);
  setTimeout(function () {
    element.classList.remove(pingColor);
  }, 1000);
}
