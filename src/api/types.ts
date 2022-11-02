export interface Version {
  version: string;
}

export interface ExtensionMenu {
  menu: Array<ExtensionMenuItem>;
}

export interface ExtensionMenuItem {
  name: String;
  extension: String | null;
}

export interface MicroFrontendJson {
  name: String;
  path: String;
  type: String;
  extension: String;
}
