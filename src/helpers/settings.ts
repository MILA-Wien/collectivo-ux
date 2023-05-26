export const settings = await import("../collectivo.json");
export const extensions: any = [];
const extension_imports = [];
for (const extension of settings.extensions) {
  const extensionModule = import(`../extensions/${extension}/extension.json`);
  extension_imports.push(extensionModule);
}
const extension_results = await Promise.allSettled(extension_imports);
for (const extension of extension_results) {
  if (extension.status === "fulfilled") {
    extensions.push(extension.value);
  }
}
