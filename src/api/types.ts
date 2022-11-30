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
  title_pre?: string;
  title_post?: string;
  first_name: string;
  last_name: string;
  gender?: Array<String>;
  date_birth?: Date;
  email: string;
  email_2?: string;
  phone?: string;
  input_type: string;
  phone_2?: string;
  address_street?: string;
  address_number?: string;
  address_is_home?: boolean;
  address_co?: string;
  address_stair?: string;
  address_door?: string;
  address_postcode?: string;
  address_city?: string;
  address_country?: string;
  legal_name?: string;
  legal_type?: string;
  legal_seat?: string;
  legal_type_id?: string;
  id?: number;
}
export interface Members {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<Member>;
}

export interface SchemaField {
  field_type: string;
  input_type: string;
  label: string;
  max_length: number;
  read_only: boolean;
  required: boolean;
  write_only: boolean;
  choices?: Array<SchemaChoiceItem>;
  condition?: SchemaCondition;
}
export interface SchemaChoiceItem {
  [key: string]: string;
}
export interface SchemaCondition {
  field: string;
  condition: string;
  value: string;
}
export interface Schema {
  [key: string]: SchemaField;
}