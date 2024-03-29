export interface Version {
  version: string;
}

export interface ExtensionMenu {
  menu: Array<ExtensionMenuItem>;
  loaded: boolean;
  label: string;
}

// ExtensionMenuItem is the type of the menu items in the extension menu
export interface ExtensionMenuItem {
  id: string | null;
  component: string | null;
  extension: string;
  icon_name: string | null;
  icon_path: string | null;
  items: Array<ExtensionMenuItem>;
  label: string;
  link: string | null;
  name: string | null;
  order: number;
  required_group: string | null;
  style: string;
  target: string | null;
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
  read_only: boolean | SchemaCondition;
  required: boolean;
  write_only: boolean;
  choices?: { [key: string]: SchemaChoiceItem };
  visible?: boolean | SchemaCondition;
  options?: Array<SchemaFieldOption>;
  help_text?: string;
  validators?: { [key: string]: any };
  schema?: Schema;
  value?: any;
  default?: any;
  calculate?: string;
}

export interface SchemaStore {
  [index: string]: DataSchema;
}

export interface Schema {
  label: string;
  description: string;
  actions: Array<
    "create" | "retrieve" | "update" | "update-bulk" | "delete" | "list"
  >;
  structure?: any;
  fields: { [key: string]: SchemaField };
}

export interface SchemaChoiceItem {
  [key: string]: string | number;
}

export interface SchemaFieldOption {
  label: string;
  value: string | number;
  key: number;
}

export interface SchemaCondition {
  field: string;
  condition: "equals" | "empty" | "not_empty";
  value?: string;
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
  history: Array<DataObject>;
  historyLoaded: boolean;
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

// shifts
export enum ShiftType {
  REGULAR = "regular",
  REPEATING_WEEKLY = "repeating_weekly",
  REPEATING_MONTHLY = "repeating_monthly",
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
export interface ShiftsList {
  date: string;
  shifts: Array<Shift>;
}

// BUG: primevue calendar does not support typed dates
// (null |string |string |Date |Date) even though it
// should and the docs say it does
export interface Shift {
  id?: number;
  shift_title: string;
  shift_starting_date: any; //string | Date;
  shift_ending_date: any; //string | Date | undefined;
  shift_type: ShiftType;
  shift_week: ShiftWeek;
  shift_starting_time: any; // string | Date | undefined;
  shift_ending_time: any; //string | Date | undefined;
  required_users: number;
  shift_day: ShiftDay;
  additional_info_general: string;
  assigned_users: Array<ShiftUser> | null;
  assignments: Array<ShiftAssignment> | null;
}

export interface ShiftUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
}

export interface ShiftAssignment {
  assigned_user: number;
  shift: number;
  attending: boolean;
  additional_info_individual: string;
}
