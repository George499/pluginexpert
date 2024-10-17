import { list } from "@keystone-6/core";
import {
  text,
  select,
  integer,
  relationship,
  slug,
} from "@keystone-6/core/fields";

export const Category = list({
  fields: {
    title: text({
      validation: { isRequired: true },
      label: "Title",
    }),
    gender: select({
      options: [
        { label: "Мужской", value: "male" },
        { label: "Женский", value: "female" },
        { label: "Средний", value: "middle" },
      ],
      ui: {
        displayMode: "segmented-control",
      },
      label: "Gender",
    }),
    slug: text({
      label: "Slug",
      validation: { isRequired: true },
      isIndexed: "unique",
    }),
    index: integer({
      label: "Index",
    }),
    body: text({
      label: "Body",
      ui: {
        displayMode: "textarea",
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ["title", "gender", "index"],
    },
  },
});
