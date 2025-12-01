--------- Admin Table -------------
CREATE TABLE IF NOT EXISTS public.bd_admin (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    cpf character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT bd_admin_pkey PRIMARY KEY (id),
    CONSTRAINT bd_admin_cpf_key UNIQUE (cpf)
)

--------- Doctor Table -------------
CREATE TABLE IF NOT EXISTS public.bd_doctor_identification (
    id_doctor bigint NOT NULL DEFAULT nextval('doctoridentification_id_doctor_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default",
    cpf character varying(255) COLLATE pg_catalog."default",
    crm character varying(255) COLLATE pg_catalog."default",
    specialty character varying(255) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    password character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT doctoridentification_pkey PRIMARY KEY (id_doctor),
    CONSTRAINT doctor_cpf_unique UNIQUE (cpf)
)


--------- Patient Table -------------
CREATE TABLE IF NOT EXISTS public.patientidentification
(
    id_patient bigint NOT NULL DEFAULT nextval('patientidentification_id_patient_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default",
    cpf character varying(255) COLLATE pg_catalog."default",
    birth_date date,
    contact_phone character varying(255) COLLATE pg_catalog."default",
    guardian_name character varying(255) COLLATE pg_catalog."default",
    guardian_contact character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT patientidentification_pkey PRIMARY KEY (id_patient),
    CONSTRAINT patient_cpf_unique UNIQUE (cpf)
)

--------- Anamnese Table -------------
CREATE TABLE IF NOT EXISTS public.bd_dados_exame (
    id_appointment integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_doctor integer,
    id_patient integer,
    date timestamp with time zone DEFAULT now(),
    main_complaint character varying(65535) COLLATE pg_catalog."default",
    behavior_observation character varying(65535) COLLATE pg_catalog."default",
    communication_notes character varying(65535) COLLATE pg_catalog."default",
    sensory_notes character varying(65535) COLLATE pg_catalog."default",
    social_interaction character varying(65535) COLLATE pg_catalog."default",
    medication_in_use character varying(65535) COLLATE pg_catalog."default",
    evolution_summary character varying(65535) COLLATE pg_catalog."default",
    next_steps character varying(65535) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT bd_dados_exame_pkey PRIMARY KEY (id_appointment),
    CONSTRAINT bd_dados_exame_id_doctor_fkey FOREIGN KEY (id_doctor)
        REFERENCES public.bd_doctor_identification (id_doctor) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT bd_dados_exame_id_patient_fkey FOREIGN KEY (id_patient)
        REFERENCES public.patientidentification (id_patient) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

--------- Forum Post Table -------------
CREATE TABLE IF NOT EXISTS public.bd_forum_post (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title character varying(255) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT bd_forum_post_pkey PRIMARY KEY (id)
)

--------- Forum Section Table -------------
CREATE TABLE IF NOT EXISTS public.bd_forum_section (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_forum_post integer,
    type integer,
    text character varying(65535) COLLATE pg_catalog."default",
    image_uri character varying(255) COLLATE pg_catalog."default",
    graph_type integer,
    section_order integer,
    CONSTRAINT bd_forum_section_pkey PRIMARY KEY (id),
    CONSTRAINT bd_forum_section_id_forum_post_fkey FOREIGN KEY (id_forum_post)
        REFERENCES public.bd_forum_post (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

--------- Forum Data Series Table -------------
CREATE TABLE IF NOT EXISTS public.bd_forum_data_series (
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_forum_section integer,
    json_file character varying(255) COLLATE pg_catalog."default",
    series_pathname character varying(255) COLLATE pg_catalog."default",
    label character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT bd_forum_data_series_pkey PRIMARY KEY (id),
    CONSTRAINT bd_forum_data_series_id_forum_section_fkey FOREIGN KEY (id_forum_section)
        REFERENCES public.bd_forum_section (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)