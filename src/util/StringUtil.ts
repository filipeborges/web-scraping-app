export function removeWhitespaceNewLine(str: string) {
  return str && str.replace("\n", "").trim();
}