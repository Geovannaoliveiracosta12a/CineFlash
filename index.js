import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ==================================================
// CONEXÃO COM O BANCO
// ==================================================

const sql = mysql.createPool({
    host: "benserverplex.ddns.net",
    database: "alunos_filmes03TA",
    user: "alunos",
    password: "senhaAlunos"
});

// ==================================================
// ROTA PRINCIPAL
// ==================================================

app.get("/api", (request, response) => {
    response.json({
        message: "API Cine Flash funcionando!"
    });
});

// ==================================================
// LISTAR FILMES
// ==================================================

app.get("/todos-filmes", (request, response) => {

    const selectCommand = `
        SELECT *
        FROM filmes_GeovannaOliveira
    `;

    sql.query(selectCommand, (error, data) => {

        if (error) {
            console.log(error);

            return response.status(500).json({
                message: "Erro ao buscar filmes."
            });
        }

        response.status(200).json(data);
    });
});

// ==================================================
// CADASTRAR FILME
// ==================================================

app.post("/create-filmes", (request, response) => {

    const {
        title,
        genre,
        duration,
        age_rating
    } = request.body;

    const insertCommand = `
        INSERT INTO filmes_GeovannaOliveira
        (title, genre, duration, age_rating)
        VALUES (?, ?, ?, ?)
    `;

    sql.query(
        insertCommand,
        [title, genre, duration, age_rating],
        (error) => {

            if (error) {
                console.log(error);

                return response.status(500).json({
                    message: "Erro ao cadastrar filme."
                });
            }

            response.status(201).json({
                message: "Filme cadastrado com sucesso!"
            });
        }
    );
});

// ==================================================
// APAGAR FILME
// ==================================================

app.delete("/delete-filmes/:id", (request, response) => {

    const { id } = request.params;

    const deleteCommand = `
        DELETE FROM filmes_GeovannaOliveira
        WHERE id = ?
    `;

    sql.query(
        deleteCommand,
        [id],
        (error) => {

            if (error) {
                console.log(error);

                return response.status(500).json({
                    message: "Erro ao apagar filme."
                });
            }

            response.status(200).json({
                message: "Filme deletado com sucesso!"
            });
        }
    );
});

// ==================================================
// ATUALIZAR FILME
// ==================================================

app.put("/update-filmes/:id", (request, response) => {

    const { id } = request.params;

    const {
        title,
        genre,
        duration,
        age_rating
    } = request.body;

    const updateCommand = `
        UPDATE filmes_GeovannaOliveira
        SET
            title = ?,
            genre = ?,
            duration = ?,
            age_rating = ?
        WHERE id = ?
    `;

    sql.query(
        updateCommand,
        [title, genre, duration, age_rating, id],
        (error) => {

            if (error) {
                console.log(error);

                return response.status(500).json({
                    message: "Erro ao atualizar filme."
                });
            }

            response.status(200).json({
                message: "Informações atualizadas com sucesso!"
            });
        }
    );
});

// ==================================================
// EXPORTAR PARA A VERCEL
// ==================================================

export default app;