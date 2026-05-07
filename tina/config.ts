import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: ".",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: ".",
    },
  },
  schema: {
    collections: [
      {
        label: "Projects",
        name: "projects",
        path: "content/projects",
        format: "json",
        match: {
          include: "projects",
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            label: "Projects",
            name: "projects",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.title || "Project",
              }),
            },
            fields: [
              { type: "string", label: "ID", name: "id", required: true },
              { type: "string", label: "Title", name: "title", required: true },
              { type: "string", label: "Slug", name: "slug", required: true },
              {
                type: "string",
                label: "Categories",
                name: "categories",
                list: true,
                required: true,
                description: "Use the existing filter keys: web-design, branding, e-commerce.",
              },
              {
                type: "string",
                label: "Tags",
                name: "tags",
                list: true,
                required: true,
              },
              {
                type: "image",
                label: "Card Image",
                name: "cardImage",
                required: true,
              },
              {
                type: "string",
                label: "Card Image Alt",
                name: "cardImageAlt",
                required: true,
              },
              {
                type: "string",
                label: "Card Description",
                name: "cardDescription",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                label: "Summary",
                name: "summary",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                label: "Detail Text",
                name: "detailText",
                required: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                label: "Highlights",
                name: "highlights",
                list: true,
                required: true,
              },
              {
                type: "string",
                label: "CTA Href",
                name: "ctaHref",
                required: true,
              },
              {
                type: "string",
                label: "CTA Label",
                name: "ctaLabel",
                required: true,
              },
              {
                type: "boolean",
                label: "Featured",
                name: "featured",
              },
              {
                type: "number",
                label: "Sort Order",
                name: "sortOrder",
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
});
