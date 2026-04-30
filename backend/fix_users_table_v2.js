const db = require("./db");

const addColumn = async (table, col, type, after) => {
  try {
    const [cols] = await db.promise().query(`SHOW COLUMNS FROM ${table} LIKE '${col}'`);
    if (cols.length === 0) {
      await db.promise().query(`ALTER TABLE ${table} ADD COLUMN ${col} ${type} AFTER ${after}`);
      console.log(`Added column ${col} to ${table}`);
    } else {
      console.log(`Column ${col} already exists in ${table}`);
    }
  } catch (err) {
    console.error(`Error adding ${col}:`, err.message);
  }
};

(async () => {
  await addColumn('users', 'weight', 'FLOAT', 'gender');
  await addColumn('users', 'height', 'FLOAT', 'weight');
  process.exit(0);
})();
