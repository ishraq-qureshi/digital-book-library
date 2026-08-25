-- Enable trigram matching so partial/fuzzy title and author search stays
-- fast (GIN index scan) instead of a sequential scan on ILIKE '%term%'.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Book_title_trgm_idx" ON "Book" USING GIN ("title" gin_trgm_ops);
CREATE INDEX IF NOT EXISTS "Book_author_trgm_idx" ON "Book" USING GIN ("author" gin_trgm_ops);
