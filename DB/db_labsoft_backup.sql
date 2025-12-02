--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-12-02 15:32:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE labsoft;
--
-- TOC entry 3483 (class 1262 OID 16389)
-- Name: labsoft; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE labsoft WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


\connect labsoft

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 230 (class 1255 OID 24626)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


--
-- TOC entry 229 (class 1255 OID 16411)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 24629)
-- Name: bd_admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_admin (
    id integer NOT NULL,
    cpf character varying(255),
    password character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 219 (class 1259 OID 24628)
-- Name: bd_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bd_admin ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bd_admin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 24646)
-- Name: bd_dados_exame; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_dados_exame (
    id_appointment integer NOT NULL,
    id_doctor integer,
    id_patient integer,
    date timestamp with time zone DEFAULT now(),
    main_complaint character varying(65535),
    behavior_observation character varying(65535),
    communication_notes character varying(65535),
    sensory_notes character varying(65535),
    social_interaction character varying(65535),
    medication_in_use character varying(65535),
    evolution_summary character varying(65535),
    next_steps character varying(65535),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 24645)
-- Name: bd_dados_exame_id_appointment_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bd_dados_exame ALTER COLUMN id_appointment ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bd_dados_exame_id_appointment_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 24604)
-- Name: bd_doctor_identification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_doctor_identification (
    id_doctor bigint NOT NULL,
    name character varying(255),
    cpf character varying(255),
    crm character varying(255),
    specialty character varying(255),
    email character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    password character varying(255)
);


--
-- TOC entry 228 (class 1259 OID 24687)
-- Name: bd_forum_data_series; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_forum_data_series (
    id integer NOT NULL,
    id_forum_section integer,
    json_file character varying(65535),
    series_pathname character varying(255),
    label character varying(255)
);


--
-- TOC entry 227 (class 1259 OID 24686)
-- Name: bd_forum_data_series_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bd_forum_data_series ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bd_forum_data_series_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 24668)
-- Name: bd_forum_post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_forum_post (
    id integer NOT NULL,
    title character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 223 (class 1259 OID 24667)
-- Name: bd_forum_post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bd_forum_post ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bd_forum_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 24674)
-- Name: bd_forum_section; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bd_forum_section (
    id integer NOT NULL,
    id_forum_post integer,
    type integer,
    text character varying(65535),
    image_uri character varying(255),
    graph_type integer,
    section_order integer
);


--
-- TOC entry 225 (class 1259 OID 24673)
-- Name: bd_forum_section_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.bd_forum_section ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bd_forum_section_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 217 (class 1259 OID 24603)
-- Name: doctoridentification_id_doctor_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctoridentification_id_doctor_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 217
-- Name: doctoridentification_id_doctor_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctoridentification_id_doctor_seq OWNED BY public.bd_doctor_identification.id_doctor;


--
-- TOC entry 216 (class 1259 OID 16401)
-- Name: patientidentification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patientidentification (
    id_patient bigint NOT NULL,
    name character varying(255),
    cpf character varying(255),
    birth_date date,
    contact_phone character varying(255),
    guardian_name character varying(255),
    guardian_contact character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: patientidentification_id_patient_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.patientidentification_id_patient_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 215
-- Name: patientidentification_id_patient_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.patientidentification_id_patient_seq OWNED BY public.patientidentification.id_patient;


--
-- TOC entry 3284 (class 2604 OID 24607)
-- Name: bd_doctor_identification id_doctor; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_doctor_identification ALTER COLUMN id_doctor SET DEFAULT nextval('public.doctoridentification_id_doctor_seq'::regclass);


--
-- TOC entry 3281 (class 2604 OID 16404)
-- Name: patientidentification id_patient; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patientidentification ALTER COLUMN id_patient SET DEFAULT nextval('public.patientidentification_id_patient_seq'::regclass);


--
-- TOC entry 3469 (class 0 OID 24629)
-- Dependencies: 220
-- Data for Name: bd_admin; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_admin OVERRIDING SYSTEM VALUE VALUES (4, '70949459062', '$2a$11$.W9z7H8yVSnqEQCt4TthZuoVJNBVRYolE61gj.1C0tpTSMzguEiHm', '2025-11-04 20:25:34.263282', '2025-11-04 20:25:34.263282');
INSERT INTO public.bd_admin OVERRIDING SYSTEM VALUE VALUES (5, '0', '$2a$11$HU2yfxRJ5SAKQAyQHs7YjO905ajMz62/0ilei5FlM42vkAML7qlAK', '2025-11-04 20:27:06.213237', '2025-11-04 20:27:06.213237');


--
-- TOC entry 3471 (class 0 OID 24646)
-- Dependencies: 222
-- Data for Name: bd_dados_exame; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (4, 1, 1, '2026-11-05 17:06:22.311+00', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', '2025-11-11 18:52:47.611823', '2025-11-11 18:52:47.611823');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (5, 1, 1, '2025-06-13 09:32:46.548+00', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', '2025-11-11 18:58:15.005974', '2025-11-11 18:58:15.005974');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (3, 1, 1, '2025-04-02 03:01:25.58+00', 'b', 'c', 'a', 'a', 'a', 'a', 'a', 'a', '2025-11-11 18:52:42.929233', '2025-11-11 19:08:29.863214');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (6, 3, 1, '2025-10-29 05:58:49.4+00', 'b', 'c', 'a', 'a', 'a', 'a', 'a', 'a', '2025-11-11 19:32:43.156986', '2025-11-11 19:45:26.834973');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (7, 3, 6, '2025-11-02 17:16:27.523+00', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', '2025-11-11 20:28:54.38109', '2025-11-11 20:28:54.38109');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (8, 3, 1, '2004-09-08 00:00:00+00', '-', '-', '-', '-', '-', '-', '-', '-', '2025-11-18 18:25:02.350312', '2025-11-18 18:25:02.350312');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (9, 3, 1, '2012-12-12 00:00:00+00', '-', '-', '-', '-', '-', '-', '-', '-', '2025-11-18 18:39:31.889121', '2025-11-18 18:39:31.889121');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (10, 3, 1, '2024-12-12 00:00:00+00', 'Algo', 'Algo', 'Algo', 'Algo', 'Algo', 'Algo', 'Algo', 'Algo', '2025-11-25 17:43:25.325437', '2025-11-25 17:43:25.325437');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (11, 3, 6, '1987-01-01 00:00:00+00', 'Perda do lobo frontal', 'Coma', 'Fala sobre um homem roxo e repete rar rar rar rar rar rar rar rar rar rar repetidamente', 'Irresponsivo', 'Em coma vei, como que interage', '10ml de copium 3x por dia', 'Ainda nada', 'Esperar pra ver', '2025-11-30 14:55:09.270281', '2025-11-30 14:55:09.270281');
INSERT INTO public.bd_dados_exame OVERRIDING SYSTEM VALUE VALUES (15, 3, 24, '2025-12-02 00:00:00+00', 'Nenhuma', 'Muito bom', 'a', 'a', 'a', 'a', 'a', 'a', '2025-12-02 17:26:35.84028', '2025-12-02 17:26:35.84028');


--
-- TOC entry 3467 (class 0 OID 24604)
-- Dependencies: 218
-- Data for Name: bd_doctor_identification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_doctor_identification VALUES (1, 'Roberto da Silva', '65417513407', '1111111111', 'Pediatra', 'robertodasilva@hob.br', '2025-11-04 15:26:42.211793', '2025-11-04 15:26:42.211793', '1234');
INSERT INTO public.bd_doctor_identification VALUES (2, 'Jicardo Santos', '42042042069', '2222222222', 'Neuro Cirugiao', 'jicardosantos@jr.jr', '2025-11-11 18:00:59.876947', '2025-11-11 18:00:59.876947', '12344');
INSERT INTO public.bd_doctor_identification VALUES (3, 'Gene Bergnaum', '48717360242', '6520', 'Autismo', 'Leone12@hotmail.com', '2025-11-11 19:31:25.893113', '2025-11-11 19:31:25.893113', '$2a$12$5rBNBup9pmUvCoUldRWZ9eADJdckv/p9DQPhYtWuyUiUzbDQl4KdO');
INSERT INTO public.bd_doctor_identification VALUES (4, 'Alison Mraz', '84434134418', '6521', 'Autismo', 'Shakira.Parisian@gmail.com', '2025-11-11 19:33:00.050764', '2025-11-11 19:33:00.050764', '$2a$12$0HbypOCWdD6QvQQT6.pfg.AwlyVARWV5Vhhtx1leZNu5i4eiswLpK');
INSERT INTO public.bd_doctor_identification VALUES (12, 'Peter Parque', '82376462402', '9798727334', 'Pediatra', 'spooderman@man.com', '2025-11-25 18:54:48.991695', '2025-11-25 18:54:48.991695', '$2a$12$UMY6KxqbFUDrGS0s4Tp6Eeoc.Jz/ikbTnwD4eKvt4nL1NhFL9iMEi');
INSERT INTO public.bd_doctor_identification VALUES (13, 'Glenda', '1245192487', '9364912497', 'Pediatra', 'spoodermanfan@man.com', '2025-11-25 19:01:19.97359', '2025-11-25 19:01:19.97359', '$2a$12$4V2Oi6xIeZgIdJw6/NHZf.EOukVbfbeFR6HyUs51l4wRV5WLJi4qe');
INSERT INTO public.bd_doctor_identification VALUES (14, 'William Afton', '9909090966', '0909090966', 'Mecânico', 'ffffffff.aaaa@gmaiil.com', '2025-11-30 15:11:01.051623', '2025-11-30 15:11:01.051623', '$2a$12$gciDaSONv05.eUOBYXR7l.6ot50yxshccclk53bZ9Q.r2sue4KT7e');
INSERT INTO public.bd_doctor_identification VALUES (15, 'Paulo Garcia Petrizzo', '0265462194', '7280235668', 'Fonoaudiologia de crianças', 'paulogp@gmail.com', '2025-12-02 16:06:56.130562', '2025-12-02 16:06:56.130562', '$2a$12$TDDcIgLtoBXZ0VQgZh.A3enJdHpFYNZN3SOvHzKulhSIgXORYRlv.');
INSERT INTO public.bd_doctor_identification VALUES (16, 'Bruno Silveira', '398.983.260-34', '123456', 'Otorrinolaringologista', 'brunosil@gmail.br', '2025-12-02 16:52:33.335778', '2025-12-02 16:52:33.335778', '$2a$12$gRybujaGOb3IkLBwGLK6tu97NflYYfcI4T5kHuYMGGNlIvkZpJuP6');


--
-- TOC entry 3477 (class 0 OID 24687)
-- Dependencies: 228
-- Data for Name: bd_forum_data_series; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_forum_data_series OVERRIDING SYSTEM VALUE VALUES (17, 39, '["  Sudeste","    Minas Gerais","    Esp\u00EDrito Santo","    Rio de Janeiro","    S\u00E3o Paulo"]', 'x', '');
INSERT INTO public.bd_forum_data_series OVERRIDING SYSTEM VALUE VALUES (18, 39, '["17915850","4247069","817039","3493037","9358705"]', 'y', '');
INSERT INTO public.bd_forum_data_series OVERRIDING SYSTEM VALUE VALUES (19, 41, '["Brasil","  Norte","    Rond\u00F4nia","    Acre","    Amazonas","    Roraima","    Par\u00E1","    Amap\u00E1","    Tocantins"]', 'x', '');
INSERT INTO public.bd_forum_data_series OVERRIDING SYSTEM VALUE VALUES (20, 41, '["45690971","4744103","397845","230833","1151269","170955","2204157","212076","376968"]', 'y', '');


--
-- TOC entry 3473 (class 0 OID 24668)
-- Dependencies: 224
-- Data for Name: bd_forum_post; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (7, 'A Importância da Intervenção Precoce no Transtorno do Espectro Autista', '2025-11-25 17:57:18.629368', '2025-11-25 17:57:18.629368');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (13, 'O que é autismo?', '2025-12-02 16:23:04.075814', '2025-12-02 16:23:04.075814');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (14, 'Autismo e Fatores Ambientais: O que diz a ciência?', '2025-12-02 16:28:25.428332', '2025-12-02 16:28:25.428332');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (15, 'Riscos e Agravantes no Dia a Dia do Autista', '2025-12-02 16:34:28.861775', '2025-12-02 16:34:28.861775');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (16, 'Como apoiar amigos e familiares autistas?', '2025-12-02 16:40:23.025681', '2025-12-02 16:40:23.025681');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (18, 'Estudantes de 6 anos ou mais de idade diagnosticados com autismo', '2025-12-02 17:12:39.880489', '2025-12-02 17:12:39.880489');
INSERT INTO public.bd_forum_post OVERRIDING SYSTEM VALUE VALUES (19, 'Meu titulo', '2025-12-02 17:18:51.476273', '2025-12-02 17:18:51.476273');


--
-- TOC entry 3475 (class 0 OID 24674)
-- Dependencies: 226
-- Data for Name: bd_forum_section; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (32, 15, 1, 'O uso excessivo e sem monitoramento de telas (celulares, tablets) é um ponto de atenção. Embora a tecnologia possa ajudar no aprendizado, o uso indiscriminado pode substituir interações sociais reais essenciais para o desenvolvimento. Estudos indicam que o excesso de telas pode aumentar a irritabilidade, prejudicar a regulação emocional e afetar a qualidade do sono, agravando comportamentos desafiadores.', 'https://br.freepik.com/vetores-gratis/campanha-de-autismo-com-fita-de-quebra-cabeca_136881192.htm#fromView=search&page=1&position=18&uuid=1dc131f4-fb24-4a9a-b27b-dba7d7f9b356&query=autismo', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (33, 15, 1, 'A privação de sono é um "risco" constante para o bem-estar da pessoa autista. Até 80% das crianças no espectro têm dificuldades para dormir (insônia ou sono agitado). A falta de descanso adequado piora drasticamente a rigidez cognitiva, aumenta a sensibilidade sensorial e diminui a tolerância a frustrações no dia seguinte, criando um ciclo de estresse para a família e a criança.', 'https://br.freepik.com/fotos-gratis/minha-cama-e-minha-melhor-amiga_12468437.htm#fromView=search&page=1&position=0&uuid=20d3c906-0bcf-4109-9c88-ac270c711bdb&query=sono', 0, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (34, 15, 0, 'A exposição contínua a ambientes barulhentos, luzes fortes ou texturas incômodas sem pausas para regulação pode levar ao "Autistic Burnout" (esgotamento). Diferente do cansaço comum, isso pode causar perda temporária de habilidades já adquiridas (como a fala) e crises (meltdowns). Respeitar os limites sensoriais não é "mimo", é uma necessidade de saúde mental para evitar regressões.', '', 0, 3);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (10, 7, 0, 'A intervenção precoce é um dos fatores mais importantes para o desenvolvimento de crianças com Transtorno do Espectro Autista (TEA). Estudos mostram que o cérebro infantil apresenta alta plasticidade nos primeiros anos de vida, o que aumenta significativamente a eficácia de terapias focadas em comunicação, comportamento e habilidades sociais.
Quando a criança tem acesso a acompanhamento especializado logo após os primeiros sinais de TEA, é possível reduzir atrasos no desenvolvimento e melhorar sua autonomia ao longo da vida.

Além disso, a intervenção precoce contribui para que famílias recebam suporte psicológico e orientação adequada, fortalecendo o ambiente de desenvolvimento da criança. Embora cada indivíduo no espectro seja único, iniciar terapias antes dos três anos de idade tem se mostrado um dos maiores fatores de impacto positivo nos resultados futuros.', 'https://images.unsplash.com/photo-1582723641741-3394e0a4edb8', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (11, 7, 0, 'O diagnóstico do autismo envolve múltiplas dimensões do desenvolvimento infantil, incluindo comunicação, interação social e padrões de comportamento repetitivos. Nos últimos anos, observou-se um aumento nos índices de identificação do TEA, não necessariamente devido a um crescimento real dos casos, mas principalmente pela ampliação dos critérios diagnósticos e maior conscientização da população.

Esse aumento de diagnósticos permite que políticas públicas sejam melhor direcionadas, especialmente no que diz respeito à inclusão escolar, capacitação de profissionais da saúde e distribuição de recursos terapêuticos. Dados do IBGE e de outras instituições brasileiras têm sido fundamentais para mapear a demanda crescente por serviços especializados e auxiliar pesquisadores e gestores em tomadas de decisão baseadas em evidências.', 'https://images.unsplash.com/photo-1551434678-e076c223a692', 1, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (24, 13, 0, 'O Transtorno do Espectro Autista (TEA) é uma condição do neurodesenvolvimento que afeta a comunicação, o comportamento e a interação social. Não é uma doença, mas uma forma diferente de perceber o mundo. É chamado de "espectro" pois se manifesta de forma única em cada indivíduo, variando do nível 1 (pouco suporte necessário) ao nível 3 (muito suporte substancial).', '', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (25, 13, 1, 'A comunicação e a interação social podem ser desafiadoras. Pessoas autistas podem ter dificuldade em interpretar nuances sociais não verbais, como expressões faciais, tom de voz ou ironia. Por outro lado, muitas são extremamente sinceras, diretas e desenvolvem formas profundas e leais de se relacionar com as pessoas ao seu redor.', 'https://img.freepik.com/fotos-gratis/crianca-brincando-com-brinquedos-em-casa_23-2149346645.jpg', 0, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (26, 13, 1, 'Comportamentos repetitivos e interesses restritos (hiperfoco) são comuns. Isso pode incluir movimentos de autorregulação (stims), apego a rotinas e um conhecimento profundo sobre assuntos específicos. O respeito a essas características, aliado a terapias adequadas, é a chave para o desenvolvimento e autonomia.', 'https://img.freepik.com/fotos-gratis/sessao-de-terapia-psicologica-para-criancas_23-2149463565.jpg', 0, 3);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (27, 13, 0, 'Fontes utilizadas neste artigo: 
    1. Manual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5); 
    2. CDC (Centers for Disease Control and Prevention) - "Signs and Symptoms of ASD"; 
    3. Ministério da Saúde (Brasil) - "Linha de Cuidado do Transtorno do Espectro do Autismo".', '', 0, 4);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (28, 14, 0, 'Estudos amplos apontam que a idade avançada dos pais na concepção é um fator de risco associado. Homens acima de 40 ou 50 anos têm maior chance de transmitir mutações genéticas espontâneas ("de novo") no esperma. Da mesma forma, a gravidez tardia (mães acima de 35 ou 40 anos) também está correlacionada a uma maior probabilidade, possivelmente devido a alterações nos óvulos ou no ambiente intrauterino.', '', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (29, 14, 0, 'O nascimento prematuro, especialmente aquele considerado extremo (antes de 28 semanas ou "5 a 6 meses"), é um fator de risco significativo. Bebês com muito baixo peso ao nascer ou que sofreram hipóxia (falta de oxigênio) podem ter o desenvolvimento cerebral afetado. Estudos indicam que quanto menor o tempo de gestação, maior a prevalência de características do espectro autista.', '', 0, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (30, 14, 1, 'Infecções virais graves durante a gestação podem interferir no neurodesenvolvimento. A Síndrome da Rubéola Congênita é uma das associações mais antigas e comprovadas com o autismo. Outras infecções que geram febre alta ou forte ativação do sistema imunológico materno (como citomegalovírus ou gripes severas) também são estudadas como fatores de risco. A vacinação pré-gestacional é a principal forma de prevenção.', 'https://img.freepik.com/fotos-gratis/medico-examinando-mulher-gravida-no-hospital_23-2148734289.jpg', 0, 3);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (31, 14, 0, 'Importante: Ter esses fatores de risco NÃO garante que a criança será autista. A genética ainda é o fator preponderante (herdabilidade estimada em 80%). Os fatores ambientais geralmente atuam como "gatilhos" em quem já tem predisposição genética. 
    Fontes: 
    1. JAMA Pediatrics (Estudos sobre idade parental); 
    2. CDC e OMS (Dados sobre Rubéola e Prematuridade); 
    3. Sociedade Brasileira de Pediatria.', '', 0, 4);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (35, 15, 0, 'Referências: 
    1. Sociedade Brasileira de Pediatria (Manual sobre Saúde de Crianças e Adolescentes na Era Digital); 
    2. "Sleep problems in Autism Spectrum Disorders" (Journal of Pediatrics); 
    3. National Autistic Society (UK) - Sensory differences.', '', 0, 4);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (36, 16, 1, 'A melhor forma de ajudar é simplificar a comunicação. Pessoas autistas tendem a ser literais. Evite "dicas sutis", ironias complexas ou frases com duplo sentido. Se você quer algo, diga diretamente e com gentileza. Além disso, respeite o tempo de processamento: se você fizer uma pergunta, espere alguns segundos a mais pela resposta sem pressionar. O silêncio não é desinteresse, é tempo de pensar.', 'https://i.postimg.cc/yYP15GhQ/conceito-de-amor-representado-pelas-maos-estendidas-entre-si.jpg', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (37, 16, 1, 'O mundo pode ser barulhento e brilhante demais para quem está no espectro. Se vocês saírem juntos, pergunte se o ambiente está confortável. Não se ofenda se seu amigo ou familiar usar fones de ouvido antirruído ou óculos escuros em lugares fechados; isso é uma ferramenta de acessibilidade, não falta de educação. Nunca force abraços ou toques físicos se a pessoa não der abertura.

A ansiedade é uma companheira constante no autismo, e a surpresa é o seu gatilho. Evite mudanças bruscas de planos. Se marcou um horário, tente cumprir. Se o plano mudou, avise com a maior antecedência possível. Convites de última hora ("vamos sair agora!") podem ser recusados não por falta de afeto, mas pela falta de preparo mental para a mudança de rotina.', 'https://i.postimg.cc/0Qqh9kPz/menina-fazendo-terapia-da-fala-em-uma-clinica.jpg', 0, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (39, 18, 2, 'Exportamos do site do IBGE os seguintes dados sobre número de estudantes de 6 anos ou mais diagnosticaso com autismo', '', 0, 1);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (40, 18, 0, 'Fonte: IBGE - Censo Demográfico', '', 0, 2);
INSERT INTO public.bd_forum_section OVERRIDING SYSTEM VALUE VALUES (41, 19, 3, 'Meu texto muito legal!!!', '', 1, 1);


--
-- TOC entry 3465 (class 0 OID 16401)
-- Dependencies: 216
-- Data for Name: patientidentification; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.patientidentification VALUES (2, 'Caique Pacha', '12345618911', '2002-02-01', '(11) 99999-8888', 'Vtuber Gigi', '(11) 98888-7777', '2025-11-02 00:00:00', '2025-11-02 22:09:25.437937');
INSERT INTO public.patientidentification VALUES (3, 'João Lucas', '12222218911', '2002-02-01', '(11) 99999-8888', 'Bruno Brunoro', '(11) 98888-7777', '2025-11-02 00:00:00', '2025-11-02 22:21:19.612777');
INSERT INTO public.patientidentification VALUES (1, 'Lucas Cavalari', '12345678900', '2004-12-15', '(11) 99999-8888', 'João Ricardo', '(11) 98888-7777', '2025-11-02 00:00:00', '2025-11-02 23:07:04.484051');
INSERT INTO public.patientidentification VALUES (4, 'Frankie Emmerich', '08057565748', '2025-06-01', '12938098320', 'Irma Hackett', '54905908823', '2025-11-11 20:27:30.516816', '2025-11-11 20:27:30.516816');
INSERT INTO public.patientidentification VALUES (5, 'Courtney Bailey-Howe', '17680003106', '2025-08-12', '40934568207', 'Tami Wehner', '63978548563', '2025-11-11 20:27:33.472183', '2025-11-11 20:27:33.472183');
INSERT INTO public.patientidentification VALUES (6, 'Diane Cronin Jr.', '12242123394', '2025-02-10', '14991011795', 'Woodrow Wolff', '21905877672', '2025-11-11 20:27:34.24257', '2025-11-11 20:30:01.194005');

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 219
-- Name: bd_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bd_admin_id_seq', 5, true);


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 221
-- Name: bd_dados_exame_id_appointment_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bd_dados_exame_id_appointment_seq', 15, true);


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 227
-- Name: bd_forum_data_series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bd_forum_data_series_id_seq', 20, true);


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 223
-- Name: bd_forum_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bd_forum_post_id_seq', 19, true);


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 225
-- Name: bd_forum_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bd_forum_section_id_seq', 41, true);


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 217
-- Name: doctoridentification_id_doctor_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.doctoridentification_id_doctor_seq', 16, true);


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 215
-- Name: patientidentification_id_patient_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.patientidentification_id_patient_seq', 24, true);


--
-- TOC entry 3303 (class 2606 OID 24639)
-- Name: bd_admin bd_admin_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_admin
    ADD CONSTRAINT bd_admin_cpf_key UNIQUE (cpf);


--
-- TOC entry 3305 (class 2606 OID 24637)
-- Name: bd_admin bd_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_admin
    ADD CONSTRAINT bd_admin_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 24655)
-- Name: bd_dados_exame bd_dados_exame_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_dados_exame
    ADD CONSTRAINT bd_dados_exame_pkey PRIMARY KEY (id_appointment);


--
-- TOC entry 3313 (class 2606 OID 24693)
-- Name: bd_forum_data_series bd_forum_data_series_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_forum_data_series
    ADD CONSTRAINT bd_forum_data_series_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 24672)
-- Name: bd_forum_post bd_forum_post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_forum_post
    ADD CONSTRAINT bd_forum_post_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 2606 OID 24680)
-- Name: bd_forum_section bd_forum_section_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_forum_section
    ADD CONSTRAINT bd_forum_section_pkey PRIMARY KEY (id);


--
-- TOC entry 3299 (class 2606 OID 24642)
-- Name: bd_doctor_identification doctor_cpf_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_doctor_identification
    ADD CONSTRAINT doctor_cpf_unique UNIQUE (cpf);


--
-- TOC entry 3301 (class 2606 OID 24613)
-- Name: bd_doctor_identification doctoridentification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_doctor_identification
    ADD CONSTRAINT doctoridentification_pkey PRIMARY KEY (id_doctor);


--
-- TOC entry 3295 (class 2606 OID 24644)
-- Name: patientidentification patient_cpf_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patientidentification
    ADD CONSTRAINT patient_cpf_unique UNIQUE (cpf);


--
-- TOC entry 3297 (class 2606 OID 16410)
-- Name: patientidentification patientidentification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patientidentification
    ADD CONSTRAINT patientidentification_pkey PRIMARY KEY (id_patient);


--
-- TOC entry 3319 (class 2620 OID 24640)
-- Name: bd_admin trigger_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_updated_at BEFORE UPDATE ON public.bd_admin FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 3320 (class 2620 OID 24666)
-- Name: bd_dados_exame trigger_set_updated_at_dados; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_set_updated_at_dados BEFORE UPDATE ON public.bd_dados_exame FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 3318 (class 2620 OID 16412)
-- Name: patientidentification update_patient_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_patient_updated_at BEFORE UPDATE ON public.patientidentification FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3314 (class 2606 OID 24656)
-- Name: bd_dados_exame bd_dados_exame_id_doctor_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_dados_exame
    ADD CONSTRAINT bd_dados_exame_id_doctor_fkey FOREIGN KEY (id_doctor) REFERENCES public.bd_doctor_identification(id_doctor);


--
-- TOC entry 3315 (class 2606 OID 24661)
-- Name: bd_dados_exame bd_dados_exame_id_patient_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_dados_exame
    ADD CONSTRAINT bd_dados_exame_id_patient_fkey FOREIGN KEY (id_patient) REFERENCES public.patientidentification(id_patient);


--
-- TOC entry 3317 (class 2606 OID 24694)
-- Name: bd_forum_data_series bd_forum_data_series_id_forum_section_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_forum_data_series
    ADD CONSTRAINT bd_forum_data_series_id_forum_section_fkey FOREIGN KEY (id_forum_section) REFERENCES public.bd_forum_section(id);


--
-- TOC entry 3316 (class 2606 OID 24681)
-- Name: bd_forum_section bd_forum_section_id_forum_post_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bd_forum_section
    ADD CONSTRAINT bd_forum_section_id_forum_post_fkey FOREIGN KEY (id_forum_post) REFERENCES public.bd_forum_post(id);


-- Completed on 2025-12-02 15:32:15

--
-- PostgreSQL database dump complete
--

