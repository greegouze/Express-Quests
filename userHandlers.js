const database = require("./database");

const getUser = (req, res) => {
  const initialSql = "select * from users"
  const where = []

  if(req.query.language != null){
    where.push({
      column:"language",
      value: req.query.language,
      operator: "=",
    })
  } 

  if(req.query.city != null){
    where.push({
      column: "city",
      value: req.query.city,
      operator:'='
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserId = (req, res) => {
  const userId = parseInt(req.params.id);
  database
    .query("select * from users where id = ?", [userId])
    .then(([users]) => {
      if (users[0] != null) {
        res.status(200).json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUsers = (req, res) => {
  //firstname, lastname, email, city, language
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Nop coco !");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("delete from users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("ça va bien mon reuf ? *-*");
      } else {
        res.status(200).send("Emballé c'est pesé !");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleted movie");
    });
};

module.exports = {
  getUser,
  getUserId,
  postUsers,
  updateUser,
  deleteUser,
};
