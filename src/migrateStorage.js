export default function migrate() {
  let v = localStorage.getItem('version');

  if (v == null) {
    localStorage.clear();
    localStorage.setItem('version', 'v1')
  }
}