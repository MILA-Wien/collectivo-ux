export interface ElementProperties {
  label?: string;
  description?: string;
  content?: string;
  icon?: string;
  htmlType?: string;
  template?: Element[];
  options?: string[];
  values?: number[];
  defaultValue?: number;
  placeholder?: string;
  isAddable?: boolean;
  validation?: string;
  className?: string;
  conditions?: ElementCondition[];
  src?: string;
  required?: boolean;
  hideLabel?: boolean;
  extId?: string;
  hidden?: boolean;
  validations?: ElementValidation[];
}
export interface ElementValidation {
  type: string;
  message: string;
  value?: string | number | null;
  values?: string[] | number[] | null;
  state?: string | number | boolean | null;
}
export interface ElementCondition {
  target: string;
  value?: string | number | null;
  operator?: string;
  values?: string[] | number[] | null;
}

export interface ElementTemplate {
  type: string;
  id?: string;
  name?: string;
  icon?: string;
  description: string;
  isDropable?: boolean;
  properties: ElementProperties;
}
export interface RootElement {
  type: string;
  children?: ElementPage[];
  name?: string;
}
export interface Elements {
  elements: ElementTemplate[];
}
export interface ElementToPage {
  element: string;
  page: string;
  position: number;
}
export interface ElementToElement {
  element: string;
  page: number;
  path: number[];
}
export interface ElementWithPath {
  page: number;
  path: number[];
  element?: Element;
}
export interface ElementValue {
  id: string;
  value: number | string | Object | Array<Number> | Array<String>;
}
export class ElementPage implements Element {
  type: string;
  children?: Element[];
  name?: string;
  id: string;
  constructor() {
    this.type = "page";
    this.id = uuidv4();
  }
}
export interface Element {
  type: string;
  properties?: ElementProperties;
  id: string;
  children?: Element[];
}
function uuidv4(): string {
  throw new Error("Function not implemented.");
}
