type ExistencePropertyFilter =
  | {
      is_empty: true;
    }
  | {
      is_not_empty: true;
    };

type TextPropertyFilter =
  | {
      equals: string;
    }
  | {
      does_not_equal: string;
    }
  | {
      contains: string;
    }
  | {
      does_not_contain: string;
    }
  | {
      starts_with: string;
    }
  | {
      ends_with: string;
    }
  | ExistencePropertyFilter;

type NumberPropertyFilter =
  | {
      equals: number;
    }
  | {
      does_not_equal: number;
    }
  | {
      greater_than: number;
    }
  | {
      less_than: number;
    }
  | {
      greater_than_or_equal_to: number;
    }
  | {
      less_than_or_equal_to: number;
    }
  | ExistencePropertyFilter;

type CheckboxPropertyFilter =
  | {
      equals: boolean;
    }
  | {
      does_not_equal: boolean;
    };

type SelectPropertyFilter =
  | {
      equals: string;
    }
  | {
      does_not_equal: string;
    }
  | ExistencePropertyFilter;

type MultiSelectPropertyFilter =
  | {
      contains: string;
    }
  | {
      does_not_contain: string;
    }
  | ExistencePropertyFilter;

type StatusPropertyFilter =
  | {
      equals: string;
    }
  | {
      does_not_equal: string;
    }
  | ExistencePropertyFilter;

/**
 * This type is a copy of
 *  `@notionhq/client` type `PropertyFilter`.
 */
export type PropertyFilter =
  | {
      title: TextPropertyFilter;
      property: string;
      type?: "title";
    }
  | {
      rich_text: TextPropertyFilter;
      property: string;
      type?: "rich_text";
    }
  | {
      number: NumberPropertyFilter;
      property: string;
      type?: "number";
    }
  | {
      checkbox: CheckboxPropertyFilter;
      property: string;
      type?: "checkbox";
    }
  | {
      select: SelectPropertyFilter;
      property: string;
      type?: "select";
    }
  | {
      multi_select: MultiSelectPropertyFilter;
      property: string;
      type?: "multi_select";
    }
  | {
      status: StatusPropertyFilter;
      property: string;
      type?: "status";
    };
