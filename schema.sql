DROP TABLE IF EXISTS classmates;

CREATE TABLE classmates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "first-name" TEXT NOT NULL,
    "last-name" TEXT NOT NULL,
    "middle-name" TEXT NOT NULL,
    study TEXT NOT NULL,
    course INTEGER NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    mail TEXT NOT NULL,
    url TEXT NOT NULL,
    vk TEXT NOT NULL,
    telegram TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    facebook TEXT NOT NULL
);