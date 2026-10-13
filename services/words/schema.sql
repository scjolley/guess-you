CREATE TABLE IF NOT EXISTS words (
 word TEXT PRIMARY KEY NOT NULL CHECK(length(word) BETWEEN 2 AND 80),
 count INTEGER NOT NULL DEFAULT 1 CHECK(count > 0)
);

CREATE VIEW IF NOT EXISTS word_review AS
 SELECT word, count AS submissions FROM words ORDER BY count DESC, word ASC;
