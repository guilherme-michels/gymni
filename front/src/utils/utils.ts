export function formatDate(data: string) {
  const formatedDate = new Date(data);

  const day = formatedDate.getDate().toString().padStart(2, "0");
  const month = (formatedDate.getMonth() + 1).toString().padStart(2, "0");

  const hour = formatedDate.getHours().toString().padStart(2, "0");
  const minutes = formatedDate.getMinutes().toString().padStart(2, "0");

  return `${day}/${month} ${hour}:${minutes}`;
}
