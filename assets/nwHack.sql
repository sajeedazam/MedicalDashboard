CREATE TABLE "project" (
  "user_id" uuid,
  "project_id" uuid,
  "project_name" varchar,
  "key_value" jsonb[],
  "created_date" timestamp,
  PRIMARY KEY ("user_id", "project_id")
);
