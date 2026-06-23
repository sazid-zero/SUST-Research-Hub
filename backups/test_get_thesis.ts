require('dotenv').config({ path: '.env.local' });
const { getThesisById } = require('./lib/db/theses');

async function test() {
    try {
        console.log("Testing getThesisById(102)...");
        const thesis = await getThesisById(102);
        if (thesis) {
            console.log("Success! Found thesis:", thesis.title);
            console.log("Models:", thesis.models);
            console.log("Datasets:", thesis.datasets);
        } else {
            console.log("Thesis not found");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
test();
