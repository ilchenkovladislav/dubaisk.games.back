CREATE TABLE "freetp" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "freetp_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"link" varchar(255) NOT NULL
);
