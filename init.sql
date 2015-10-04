


CREATE SEQUENCE untitled_table_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;

CREATE TABLE budget
(
  id integer NOT NULL DEFAULT nextval('untitled_table_id_seq'::regclass),
  name text,
  title text,
  ogimage text,
  description text,
  budgets text[],
  ts timestamp without time zone DEFAULT now(),
  ts_update timestamp without time zone DEFAULT now(),
  user_id bigint,
  CONSTRAINT untitled_table_pkey PRIMARY KEY (id)
);


INSERT INTO "budget"("id","name","title","ogimage","description","budgets","ts","ts_update","user_id") 
VALUES (1,E'台北市',E'台北市  2016 總預算',E'http://tpebudget.tonyq.org/img/ogimage.png',E'快來瞭解台北市 2016 年預算類型、內容！',E'{https://cdn.rawgit.com/tony1223/6a3bee53b175b2d4429f/raw/5e6cffa9d2d6bed87401156c66d3424952a7bf9e/gistfile1.txt,https://api.myjson.com/bins/1vyte}',E'2015-10-04 14:21:50.164221',E'2015-10-04 14:21:50.164221',1), 
(2,E'高雄市',E'高雄市 2016 總預算',E'http://ksbudget.tonyq.org/img/ogimage.png',E'快來瞭解高雄市 2016 年預算類型、內容！',E'{http://tony1223.github.io/ks-budget-convert/output/%E6%AD%B2%E5%87%BA%E6%A9%9F%E9%97%9C%E5%88%A5%E9%A0%90%E7%AE%97%E8%A1%A8_g0v.json}',E'2015-10-04 14:51:29.977364',E'2015-10-04 14:51:29.977364',1);