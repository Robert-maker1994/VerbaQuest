-- Create the languages table
CREATE TABLE languages (
    language_id SERIAL PRIMARY KEY,
    language_code VARCHAR(10) UNIQUE NOT NULL,
    language_name VARCHAR(255) NOT NULL
);

-- Create the words table
CREATE TABLE words (
    word_id SERIAL PRIMARY KEY,
    language_id INTEGER NOT NULL REFERENCES languages(language_id) ON DELETE CASCADE,
    word_text VARCHAR(255) NOT NULL,
    definition TEXT,
    wordle_valid BOOLEAN DEFAULT FALSE -- Added for Wordle compatibility
);

-- Create the crosswords table
CREATE TABLE crosswords (
    crossword_id SERIAL PRIMARY KEY,
    language_id INTEGER NOT NULL REFERENCES languages(language_id) ON DELETE CASCADE,
    title VARCHAR(255),
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    difficulty INTEGER NOT NULL
);

-- Create the crossword_words table
CREATE TABLE crossword_words (
    crossword_word_id SERIAL PRIMARY KEY,
    crossword_id INTEGER NOT NULL REFERENCES crosswords(crossword_id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,
    clue TEXT NOT NULL,
    UNIQUE (crossword_id, word_id)
);

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,  -- Optional, as discussed
    password_hash VARCHAR(255),   -- Can be NULL for Google Sign In only
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    google_id VARCHAR(255) UNIQUE
);

-- Create the user_crossword_progress table
CREATE TABLE user_crossword_progress (
    user_crossword_progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    crossword_id INTEGER NOT NULL REFERENCES crosswords(crossword_id) ON DELETE CASCADE,
    grid_state TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_attempted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the word_of_the_day table
CREATE TABLE word_of_the_day (
    word_of_the_day_id SERIAL PRIMARY KEY,
    language_id INTEGER NOT NULL REFERENCES languages(language_id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(word_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    UNIQUE (language_id, date)
);

-- Create the topics table
CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(255) UNIQUE NOT NULL,
    language_id INTEGER NOT NULL REFERENCES languages(language_id) ON DELETE CASCADE
);

-- Create the crossword_topics table
CREATE TABLE crossword_topics (
    crossword_topic_id SERIAL PRIMARY KEY,
    crossword_id INTEGER NOT NULL REFERENCES crosswords(crossword_id) ON DELETE CASCADE,
    topic_id INTEGER NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    UNIQUE (crossword_id, topic_id)
);

-- Create the tenses table
CREATE TABLE tenses (
    tense_id SERIAL PRIMARY KEY,
    tense_name VARCHAR(255) NOT NULL,
    language_id INTEGER NOT NULL
);

-- Create the verbs table
CREATE TABLE verbs (
    verb_id SERIAL PRIMARY KEY,
    infinitive VARCHAR(255) UNIQUE NOT NULL,
    english_translation VARCHAR(255) NOT NULL,
    language_id INTEGER NOT NULL
);

-- Create the conjugations table
CREATE TABLE conjugations (
    conjugation_id SERIAL PRIMARY KEY,
    verb_id INTEGER NOT NULL REFERENCES verbs(verb_id) ON DELETE CASCADE,
    tense_id INTEGER NOT NULL REFERENCES tenses(tense_id) ON DELETE CASCADE,
    grammatical_person VARCHAR(50) NOT NULL,  -- Corrected: Was missing NOT NULL
    conjugated_form VARCHAR(255) NOT NULL,
    reflexive BOOLEAN NOT NULL DEFAULT FALSE,
    language_id INTEGER NOT NULL
);

-- Create the user_verb_progress table
CREATE TABLE user_verb_progress(
    user_verb_progress_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    conjugation_id INTEGER NOT NULL REFERENCES conjugations(conjugation_id) ON DELETE CASCADE,
    attempts INTEGER NOT NULL DEFAULT 0,
    correct BOOLEAN NOT NULL DEFAULT FALSE,
    last_attempted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, conjugation_id)
);

-- Optional: Add indexes for performance
CREATE INDEX idx_crossword_words_crossword_id ON crossword_words (crossword_id);
CREATE INDEX idx_crossword_words_word_id ON crossword_words (word_id);
CREATE INDEX idx_user_crossword_progress_user_id ON user_crossword_progress (user_id);
CREATE INDEX idx_user_crossword_progress_crossword_id ON user_crossword_progress (crossword_id);
CREATE INDEX idx_word_of_the_day_language_id ON word_of_the_day (language_id);
CREATE INDEX idx_word_of_the_day_date ON word_of_the_day (date);
CREATE INDEX idx_crossword_topics_crossword_id ON crossword_topics (crossword_id);
CREATE INDEX idx_crossword_topics_topic_id ON crossword_topics (topic_id);
CREATE INDEX idx_words_language_id ON words (language_id);
CREATE INDEX idx_verbs_language_id ON verbs(language_id);
CREATE INDEX idx_conjugations_verb_id ON conjugations(verb_id);
CREATE INDEX idx_conjugations_tense_id ON conjugations(tense_id);
CREATE INDEX idx_user_verb_progress_user_id ON user_verb_progress(user_id);
CREATE INDEX idx_user_verb_progress_conjugation_id ON user_verb_progress(conjugation_id);
CREATE INDEX idx_tenses_language_id ON tenses(language_id); -- Added index

