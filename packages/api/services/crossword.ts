import { getConnection } from "../libs/connection";

async function getCrossword(filter?: string) {
    const client = await getConnection();

    const crossword = await client.query<{
        title: string,
        clue: string,
        topic_name: String,
        word_text: string
    }>(`
        select title, w.word_text, clue, t.topic_name from crosswords c
            join crossword_topics ct on c.crossword_id = ct.crossword_id 
            join topics t on ct.topic_id = t.topic_id 
            join crossword_words cw on c.crossword_id = cw.crossword_id 
            join words w on cw.word_id = w.word_id 
	    where c.crossword_id = '1'
        `)


    return crossword.rows
}

export { getCrossword }