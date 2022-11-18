export interface Version {
  version: string;
}

export interface ExtensionMenu {
  menu: Array<ExtensionMenuItem>;
}

export interface ExtensionMenuItem {
  item_id: string | null;
  label: string;
  action: string | null;
  action_target: string | null;
  component_name: string | null;
  link_source: string | null;
  order: number;
  style: string;
  required_role: string | null;
  icon_name: string | null;
  icon_path: string | null;
  menu_id: string;
  extension: string;
  parent_item: string | null;
}
export interface MicroFrontendJson {
  name: String;
  path: String;
  type: String;
  extension: String;
}
export interface LoginData {
  username: string;
  password: string;
}
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  last_login: string;
  date_joined: string;
  token: string;
  refreshToken: string;
  tokenParsed: any;
  userInfo: any;
  authenticated: boolean;
  loginUrl: string;
  logoutUrl: string;
  registerUrl: string;
  accountUrl: string;
  redirectUri: string | undefined;
  profile: any;
}
export interface Member {
  id?: number;
  user_id?: string;
  user_attr: string | null;
  create_attr?: string | null;
  admin_attr?: string | null;
}
export interface Members {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<Member>;
}