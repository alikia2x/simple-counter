import { Database } from "bun:sqlite";
import path from "path";

const dbPath = path.resolve(import.meta.dir, "./count.db");
const db = new Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS tb_count (
    id    INTEGER           PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
    name  VARCHAR (1024)    NOT NULL UNIQUE,
    num   BIGINT            NOT NULL DEFAULT (0) 
);`);

const getStmt = db.query("SELECT name, num FROM tb_count WHERE name = $name");
const updateStmt = db.query(`
    INSERT INTO tb_count(name, num) VALUES($name, $num)
    ON CONFLICT(name) DO UPDATE SET num = $num
`);

async function getCountByName(name: string) {
    const row = getStmt.get({ $name: name }) as { name: string; num: number } | null;
    let currentNum = row ? Number(row.num) : 0;
    const newNum = currentNum + 1;
    updateStmt.run({ $name: name, $num: newNum });
    return { name, num: newNum };
}

const PORT = Bun.env.PORT ?? 3000;

Bun.serve({
    port: PORT,
    routes: {
        "/count/*": async (req) => {
            const url = new URL(req.url);
            const data = await getCountByName(url.pathname.slice(6));

            return Response.json(data, {
                headers: {
                    "Access-Control-Allow-Origin": "https://blog.alikia2x.com",
                    "Access-Control-Allow-Methods": "GET",
                },
            });
        },
    },

    fetch() {
        return Response.json(
            {
                error: "Not Found",
            },
            { status: 404 }
        );
    },
});

console.log(`Server running at http://localhost:${PORT}`);
