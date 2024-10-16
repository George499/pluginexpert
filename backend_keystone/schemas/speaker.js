import { list } from "@keystone-6/core";
import { text, relationship, image, select } from "@keystone-6/core/fields";
import { allowAll } from "@keystone-6/core/access";

export const Speaker = list({
  access: allowAll,
  fields: {
    name: text({
      validation: { isRequired: true },
      label: "Name",
    }),
    slug: text({
      isIndexed: "unique",
      label: "Slug",
      validation: { isRequired: true },
    }),
    categories: relationship({
      ref: "Category",
      many: true,
      label: "Categories",
    }),

    profession: text({
      label: "Profession",
    }),
    bio: text({
      label: "Bio",
      ui: {
        displayMode: "textarea",
      },
    }),
    speechTopics: text({
      label: "Speech Topics",
      ui: {
        displayMode: "textarea",
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ["name", "slug", "image"],
    },
  },
});
