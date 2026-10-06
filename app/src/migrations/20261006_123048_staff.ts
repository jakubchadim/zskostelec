import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_staff_buildings_workplace" AS ENUM('palackeho', 'komenskeho', 'drtinova', 'erbenova');
  CREATE TABLE "staff" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"photo_id" integer,
  	"priority" numeric DEFAULT 50 NOT NULL,
  	"wp_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "staff_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"staff_positions_id" integer,
  	"staff_buildings_id" integer
  );
  
  CREATE TABLE "staff_positions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"wp_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "staff_buildings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"workplace" "enum_staff_buildings_workplace",
  	"wp_id" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_positions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "staff_buildings_id" integer;
  ALTER TABLE "staff" ADD CONSTRAINT "staff_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "staff_rels" ADD CONSTRAINT "staff_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_rels" ADD CONSTRAINT "staff_rels_staff_positions_fk" FOREIGN KEY ("staff_positions_id") REFERENCES "public"."staff_positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "staff_rels" ADD CONSTRAINT "staff_rels_staff_buildings_fk" FOREIGN KEY ("staff_buildings_id") REFERENCES "public"."staff_buildings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "staff_photo_idx" ON "staff" USING btree ("photo_id");
  CREATE UNIQUE INDEX "staff_wp_id_idx" ON "staff" USING btree ("wp_id");
  CREATE INDEX "staff_updated_at_idx" ON "staff" USING btree ("updated_at");
  CREATE INDEX "staff_created_at_idx" ON "staff" USING btree ("created_at");
  CREATE INDEX "staff_rels_order_idx" ON "staff_rels" USING btree ("order");
  CREATE INDEX "staff_rels_parent_idx" ON "staff_rels" USING btree ("parent_id");
  CREATE INDEX "staff_rels_path_idx" ON "staff_rels" USING btree ("path");
  CREATE INDEX "staff_rels_staff_positions_id_idx" ON "staff_rels" USING btree ("staff_positions_id");
  CREATE INDEX "staff_rels_staff_buildings_id_idx" ON "staff_rels" USING btree ("staff_buildings_id");
  CREATE UNIQUE INDEX "staff_positions_name_idx" ON "staff_positions" USING btree ("name");
  CREATE UNIQUE INDEX "staff_positions_wp_id_idx" ON "staff_positions" USING btree ("wp_id");
  CREATE INDEX "staff_positions_updated_at_idx" ON "staff_positions" USING btree ("updated_at");
  CREATE INDEX "staff_positions_created_at_idx" ON "staff_positions" USING btree ("created_at");
  CREATE UNIQUE INDEX "staff_buildings_name_idx" ON "staff_buildings" USING btree ("name");
  CREATE UNIQUE INDEX "staff_buildings_wp_id_idx" ON "staff_buildings" USING btree ("wp_id");
  CREATE INDEX "staff_buildings_updated_at_idx" ON "staff_buildings" USING btree ("updated_at");
  CREATE INDEX "staff_buildings_created_at_idx" ON "staff_buildings" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_positions_fk" FOREIGN KEY ("staff_positions_id") REFERENCES "public"."staff_positions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_staff_buildings_fk" FOREIGN KEY ("staff_buildings_id") REFERENCES "public"."staff_buildings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_staff_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_id");
  CREATE INDEX "payload_locked_documents_rels_staff_positions_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_positions_id");
  CREATE INDEX "payload_locked_documents_rels_staff_buildings_id_idx" ON "payload_locked_documents_rels" USING btree ("staff_buildings_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "staff" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff_positions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "staff_buildings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "staff" CASCADE;
  DROP TABLE "staff_rels" CASCADE;
  DROP TABLE "staff_positions" CASCADE;
  DROP TABLE "staff_buildings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_positions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_staff_buildings_fk";
  
  DROP INDEX "payload_locked_documents_rels_staff_id_idx";
  DROP INDEX "payload_locked_documents_rels_staff_positions_id_idx";
  DROP INDEX "payload_locked_documents_rels_staff_buildings_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "staff_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "staff_positions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "staff_buildings_id";
  DROP TYPE "public"."enum_staff_buildings_workplace";`)
}
