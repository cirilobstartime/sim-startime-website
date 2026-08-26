import type { CollectionConfig } from "payload";
import { administratorsOnly, administratorsOrSelf } from "../access";

export const Users: CollectionConfig = {
  slug: "cms-users",
  auth: {
    tokenExpiration: 8 * 60 * 60,
  },
  access: {
    create: administratorsOnly,
    delete: administratorsOnly,
    read: administratorsOrSelf,
    update: administratorsOrSelf,
  },
  admin: {
    group: "Administration",
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "select",
      defaultValue: "editor",
      options: [
        { label: "Administrator", value: "administrator" },
        { label: "Content editor", value: "editor" },
      ],
      access: {
        update: administratorsOnly,
      },
      required: true,
    },
  ],
};
