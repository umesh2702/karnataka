import dotenv from "dotenv";
dotenv.config({ override: true });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "postgresql://postgres:umesh_1234@localhost:5432/leadership_studio?schema=public",
  },
});
