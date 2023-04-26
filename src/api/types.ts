export interface Version {
  version: string;
}

export interface ExtensionMenu {
  menu: Array<ExtensionMenuItem>;
  loaded: boolean;
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
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: Array<String>;
  occupation?: string;
  address_street?: string;
  address_number?: string;
  address_stair?: string;
  address_door?: string;
  address_postcode?: string;
  address_city?: string;
  address_country?: string;
  phone?: string;
  membership_start?: Date;
  shares_number?: string;
  person_type?: string;
}
export interface DataListResponse {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<any>;
}
export interface DashboardTiles {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<DashboardTile>;
}

export interface DashboardTileButton {
  id: number;
  label: string;
  link: string;
  link_type: "internal" | "external";
}

export interface DashboardTile {
  id: string;
  content: string;
  component: string;
  order: number;
  required_group?: string;
  label: string;
  extension?: number;
  extension_name?: string;
  source: "component" | "db";
  buttons: Array<any>;
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

export interface Schema {
  [key: string]: SchemaField;
}
export interface SchemaChoiceItem {
  [key: string]: string;
}
export interface SchemaCondition {
  field: string;
  condition: string;
  value: string;
}

// Store attributes
// Attributes can either be for a single object or a list of objects

export interface DataObject {
  id: number | null;
  [key: string]: any;
}
export interface DataSchema {
  schema: Schema;
  schemaLoaded: boolean;
  list: Array<DataObject>;
  listLoaded: boolean;
  listTotalRecords: number;
  detail: DataObject;
  detailLoaded: boolean;
}

// Store templates
export const DataTemplate = {
  schema: {},
  schemaLoaded: false,
  list: [],
  listLoaded: false,
  listTotalRecords: 0,
  detail: { id: null },
  detailLoaded: false,
};
