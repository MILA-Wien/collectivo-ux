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
export interface Members {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<Member>;
}
export interface DashboardTiles {
  count?: number;
  next?: string;
  previous?: string;
  results: Array<DashboardTile>;
}
export interface DashboardTile {
  tile_id: string;
  component_name: string;
  order: number;
  required_role?: string;
  blocked_role?: string;
  label?: string;
  extension: string;
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
export interface DataSchema {
  schema: Schema;
  schemaLoaded: boolean;
}
export interface DataObject {
  id: number | null;
  [key: string]: any;
}
export interface DataDetail extends DataSchema {
  loaded: boolean;
  data: DataObject;
}
export interface DataList extends DataSchema {
  loaded: boolean;
  data: Array<DataObject>;
}

// Store templates
export const DataListTemplate = {
  schema: {},
  data: [],
  loaded: false,
  schemaLoaded: false,
};

export const DataDetailTemplate = {
  schema: {},
  data: { id: null },
  loaded: false,
  schemaLoaded: false,
};


// shifts
export enum ShiftType {
  REGULAR = "regular",
  EXTRA = "extra",
  HOLIDAY = "holiday",
  OTHER = "other",
}
export enum ShiftWeek {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}
export enum ShiftDay {
  MONDAY = "Monday",
  TUESDAY = "Tuesday",
  WEDNESDAY = "Wednesday",
  THURSDAY = "Thursday",
  FRIDAY = "Friday",
  SATURDAY = "Saturday",
  SUNDAY = "Sunday",
}

export interface Shift {
  shift_title: string;
  shift_starting_date: string | Date;
  shift_ending_date: string | Date;
  shift_type: ShiftType;
  shift_week: ShiftWeek;
  shift_starting_time: string | Date;
  shift_ending_time: string | Date;
  required_users: Number;
  shift_day: ShiftDay;
  additional_info_general: string;
}