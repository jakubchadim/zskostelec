import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { backfillSearchText } from '../cms/search-text'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"order" numeric DEFAULT 10 NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "posts" ADD COLUMN "search_text" varchar;
  ALTER TABLE "posts_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_search_text" varchar;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "galleries" ADD COLUMN "search_text" varchar;
  ALTER TABLE "galleries_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "_galleries_v" ADD COLUMN "version_search_text" varchar;
  ALTER TABLE "_galleries_v_rels" ADD COLUMN "tags_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tags_id" integer;
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "galleries_rels" ADD CONSTRAINT "galleries_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_galleries_v_rels" ADD CONSTRAINT "_galleries_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "galleries_rels_tags_id_idx" ON "galleries_rels" USING btree ("tags_id");
  CREATE INDEX "_galleries_v_rels_tags_id_idx" ON "_galleries_v_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");`)

  // The school renamed "Upozornění" to "Oznámení školy" (menu, homepage); the URL stays /clanky/upozorneni/.
  await db.execute(sql`UPDATE categories SET title = 'Oznámení školy' WHERE slug = 'upozorneni' AND title = 'Upozornění'`)

  // Articles and galleries saved before the search column existed.
  const filled = await backfillSearchText(db)
  payload.logger.info(`search_text filled: ${filled.posts} posts, ${filled.galleries} galleries`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "tags" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "tags" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_tags_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_tags_fk";
  
  ALTER TABLE "galleries_rels" DROP CONSTRAINT "galleries_rels_tags_fk";
  
  ALTER TABLE "_galleries_v_rels" DROP CONSTRAINT "_galleries_v_rels_tags_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tags_fk";
  
  DROP INDEX "posts_rels_tags_id_idx";
  DROP INDEX "_posts_v_rels_tags_id_idx";
  DROP INDEX "galleries_rels_tags_id_idx";
  DROP INDEX "_galleries_v_rels_tags_id_idx";
  DROP INDEX "payload_locked_documents_rels_tags_id_idx";
  ALTER TABLE "posts" DROP COLUMN "search_text";
  ALTER TABLE "posts_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_search_text";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "galleries" DROP COLUMN "search_text";
  ALTER TABLE "galleries_rels" DROP COLUMN "tags_id";
  ALTER TABLE "_galleries_v" DROP COLUMN "version_search_text";
  ALTER TABLE "_galleries_v_rels" DROP COLUMN "tags_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tags_id";`)
}
