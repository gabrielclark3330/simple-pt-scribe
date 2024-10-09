--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg120+1)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: note; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.note (
    id integer NOT NULL,
    patient_id integer,
    transcript text,
    subjective text,
    objective text,
    assessment text,
    plan text,
    length text,
    date_recorded text,
    type text,
    note_owner integer
);


ALTER TABLE public.note OWNER TO myuser;

--
-- Name: note_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

ALTER TABLE public.note ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.note_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: patient; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.patient (
    id integer NOT NULL,
    first_name text,
    last_name text
);


ALTER TABLE public.patient OWNER TO myuser;

--
-- Name: patient_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

ALTER TABLE public.patient ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.patient_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: profile; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public.profile (
    id integer NOT NULL,
    password text,
    email text,
    first_name text,
    last_name text
);


ALTER TABLE public.profile OWNER TO myuser;

--
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

ALTER TABLE public.profile ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.profile_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: note note_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_pkey PRIMARY KEY (id);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (id);


--
-- Name: profile profile_email_key; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_email_key UNIQUE (email);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);


--
-- Name: note note_note_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_note_owner_fkey FOREIGN KEY (note_owner) REFERENCES public.profile(id);


--
-- Name: note note_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public.note
    ADD CONSTRAINT note_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id);


--
-- PostgreSQL database dump complete
--