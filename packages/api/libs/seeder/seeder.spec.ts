
import { createTables } from "./seeder";


describe('createClient', () => {
  it('should create a new PostgreSQL client with correct configuration', () => {
        const read = createTables();
        console.log({read})
        // expect(read).toBe("")
  })

});