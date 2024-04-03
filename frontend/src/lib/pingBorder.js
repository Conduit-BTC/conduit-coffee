export default function pingBorder(element, pingColor) {
  const pingType = pingColor == "red" ? "ping-red" : "ping-blue";
  element.classList.add(pingType);
  setTimeout(function () {
    element.classList.remove(pingType);
  }, 1000);
}
