import type { ElementTemplate } from "../types/elements";

// the icon uses the icons from foundation https://zurb.com/playground/foundation-icon-fonts-3

const page: ElementTemplate = {
  type: "page",
  icon: "page",
  description: "A page for holding children",
  properties: {
    conditions: [],
  },
};
const textfield: ElementTemplate = {
  type: "textfield",
  icon: "quote",
  description: "simple text input",
  properties: {
    htmlType: "text",
    conditions: [],
    label: "New textfield",
  },
};
const paragraph: ElementTemplate = {
  type: "paragraph",
  icon: "align-justify",
  description: "simple paragraph for descriptions or introductions",
  properties: {
    htmlType: "p",
    conditions: [],
    label: "New text",
    content: "This is a text",
  },
};
const plainHtml: ElementTemplate = {
  type: "plainHtml",
  icon: "html5",
  description: "html that is rendered",
  properties: {
    label: "Html",
    conditions: [],
    content: "<b>This</b> is a text",
  },
};
const image: ElementTemplate = {
  type: "image",
  description: "an img that is shown",
  icon: "photo",
  properties: {
    label: "Image",
    conditions: [],
    src: "https://www.fillmurray.com/640/360",
  },
};
const empty: ElementTemplate = {
  type: "empty",
  description: "used as placeholder for nested forms",
  properties: {
    conditions: [],
  },
};
const multipeChoice: ElementTemplate = {
  type: "multipleChoice",
  icon: "checkbox",
  description: "checkboxes",
  properties: {
    htmlType: "checkbox",
    label: "New checkbox",
    conditions: [],
    options: ["label1", "label2", "label3"],
    values: [1, 2, 3],
  },
};
const singleChoice: ElementTemplate = {
  type: "singleChoice",
  icon: "record",
  description: "radio buttons",
  properties: {
    label: "New radios",
    htmlType: "radio",
    conditions: [],
    options: ["label1", "label2", "label3"],
    values: [1, 2, 3],
  },
};
const hidden: ElementTemplate = {
  type: "hidden",
  icon: "asterisk",
  description: "A field for hiding stuff in the dark",
  properties: {
    conditions: [],
  },
};
const number: ElementTemplate = {
  type: "number",
  icon: "asterisk",
  description: "A field for hiding stuff in the dark",
  properties: {
    conditions: [],
  },
};
const date: ElementTemplate = {
  type: "date",
  icon: "asterisk",
  description: "A field for hiding stuff in the dark",
  properties: {
    conditions: [],
  },
};
const button: ElementTemplate = {
  type: "button",
  icon: "arrow-right",
  description: "Submit your stuff or next page",
  properties: {
    label: "newButton",
    conditions: [],
  },
};

export const ElementTypes: ElementTemplate[] = [
  page,
  textfield,
  multipeChoice,
  singleChoice,
  empty,
  hidden,
  paragraph,
  plainHtml,
  image,
  button,
  number,
  date,
];
