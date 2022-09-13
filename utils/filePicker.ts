import merge from "./merge";
export default (options: Partial<HTMLInputElement>) => {
  const input = document.createElement("input");
  input.type = "file";
  merge(input, options);
  input.click();
};