--
-- PostgreSQL database dump
--

-- Dumped from database version 17.10 (21f7c76)
-- Dumped by pg_dump version 18.2

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
-- Name: log_download_count(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.log_download_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO download_counts (content_type, content_id, file_id, user_id, ip_address, file_size_bytes)
    VALUES (NEW.content_type, NEW.content_id, NEW.file_id, NEW.user_id, NEW.ip_address, NEW.file_size_bytes);
    
    PERFORM update_content_popularity_stats(NEW.content_type, NEW.content_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_download_count() OWNER TO neondb_owner;

--
-- Name: log_view_count(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.log_view_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO view_counts (content_type, content_id, user_id, ip_address, user_agent)
    VALUES (NEW.content_type, NEW.content_id, NEW.user_id, NEW.ip_address, NEW.user_agent);
    
    PERFORM update_content_popularity_stats(NEW.content_type, NEW.content_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_view_count() OWNER TO neondb_owner;

--
-- Name: update_content_popularity_stats(character varying, integer); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.update_content_popularity_stats(p_content_type character varying, p_content_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO content_popularity (content_type, content_id, total_views, total_downloads, updated_at)
    SELECT 
        p_content_type,
        p_content_id,
        COUNT(DISTINCT CASE WHEN vc.content_type = p_content_type AND vc.content_id = p_content_id THEN vc.id END),
        COUNT(DISTINCT CASE WHEN dc.content_type = p_content_type AND dc.content_id = p_content_id THEN dc.id END),
        NOW()
    FROM view_counts vc
    FULL OUTER JOIN download_counts dc ON vc.content_type = dc.content_type AND vc.content_id = dc.content_id
    ON CONFLICT (content_type, content_id) 
    DO UPDATE SET
        total_views = (SELECT COUNT(*) FROM view_counts WHERE content_type = p_content_type AND content_id = p_content_id),
        total_downloads = (SELECT COUNT(*) FROM download_counts WHERE content_type = p_content_type AND content_id = p_content_id),
        updated_at = NOW(),
        trending_score = (
            (SELECT COUNT(*) FROM view_counts WHERE content_type = p_content_type AND content_id = p_content_id AND viewed_at > NOW() - INTERVAL '30 days') * 0.3 +
            (SELECT COUNT(*) FROM download_counts WHERE content_type = p_content_type AND content_id = p_content_id AND downloaded_at > NOW() - INTERVAL '30 days') * 0.7
        )::DECIMAL;
END;
$$;


ALTER FUNCTION public.update_content_popularity_stats(p_content_type character varying, p_content_id integer) OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authorship_claims; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.authorship_claims (
    id integer NOT NULL,
    user_id integer NOT NULL,
    workspace_type character varying(50) NOT NULL,
    workspace_id integer NOT NULL,
    author_name_matched character varying(255) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolved_at timestamp without time zone,
    resolved_by integer,
    notes text,
    CONSTRAINT authorship_claims_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT authorship_claims_workspace_type_check CHECK (((workspace_type)::text = ANY ((ARRAY['thesis'::character varying, 'publication'::character varying])::text[])))
);


ALTER TABLE public.authorship_claims OWNER TO neondb_owner;

--
-- Name: authorship_claims_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.authorship_claims_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.authorship_claims_id_seq OWNER TO neondb_owner;

--
-- Name: authorship_claims_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.authorship_claims_id_seq OWNED BY public.authorship_claims.id;


--
-- Name: content_contributors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.content_contributors (
    id integer NOT NULL,
    dataset_id integer,
    model_id integer,
    user_id integer,
    contributor_role character varying(100) DEFAULT 'creator'::character varying,
    contribution_percentage integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT content_contributors_contributor_role_check CHECK (((contributor_role)::text = ANY ((ARRAY['creator'::character varying, 'contributor'::character varying, 'maintainer'::character varying])::text[])))
);


ALTER TABLE public.content_contributors OWNER TO neondb_owner;

--
-- Name: content_contributors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.content_contributors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_contributors_id_seq OWNER TO neondb_owner;

--
-- Name: content_contributors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.content_contributors_id_seq OWNED BY public.content_contributors.id;


--
-- Name: content_popularity; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.content_popularity (
    id integer NOT NULL,
    content_type character varying(50) NOT NULL,
    content_id integer NOT NULL,
    total_views integer DEFAULT 0,
    total_downloads integer DEFAULT 0,
    unique_viewers integer DEFAULT 0,
    unique_downloaders integer DEFAULT 0,
    trending_score numeric(10,4) DEFAULT 0,
    last_viewed_at timestamp without time zone,
    last_downloaded_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.content_popularity OWNER TO neondb_owner;

--
-- Name: content_popularity_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.content_popularity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_popularity_id_seq OWNER TO neondb_owner;

--
-- Name: content_popularity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.content_popularity_id_seq OWNED BY public.content_popularity.id;


--
-- Name: dataset_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.dataset_files (
    id integer NOT NULL,
    dataset_id integer,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_size numeric,
    file_type text,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dataset_files OWNER TO neondb_owner;

--
-- Name: dataset_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.dataset_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dataset_files_id_seq OWNER TO neondb_owner;

--
-- Name: dataset_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.dataset_files_id_seq OWNED BY public.dataset_files.id;


--
-- Name: datasets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.datasets (
    id integer NOT NULL,
    thesis_id integer,
    title text NOT NULL,
    description text,
    dataset_type character varying(100) DEFAULT 'research'::character varying NOT NULL,
    size_mb numeric(10,2),
    file_format character varying(100),
    records_count integer,
    download_url text NOT NULL,
    cloudinary_url text,
    collection_date date,
    last_updated date,
    license character varying(100),
    accessibility_level character varying(50) DEFAULT 'public'::character varying,
    keywords text[],
    tags text[],
    views integer DEFAULT 0,
    downloads integer DEFAULT 0,
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    published_at timestamp without time zone,
    workspace_id integer,
    workspace_type text,
    CONSTRAINT datasets_accessibility_level_check CHECK (((accessibility_level)::text = ANY ((ARRAY['public'::character varying, 'registered'::character varying, 'restricted'::character varying])::text[]))),
    CONSTRAINT datasets_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.datasets OWNER TO neondb_owner;

--
-- Name: datasets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.datasets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.datasets_id_seq OWNER TO neondb_owner;

--
-- Name: datasets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.datasets_id_seq OWNED BY public.datasets.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    workspace_id integer NOT NULL,
    workspace_type text NOT NULL,
    name text NOT NULL,
    file_path text NOT NULL,
    file_size numeric,
    file_type text,
    uploaded_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.documents OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documents_id_seq OWNER TO neondb_owner;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: download_counts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.download_counts (
    id integer NOT NULL,
    content_type character varying(50) NOT NULL,
    content_id integer NOT NULL,
    file_id integer,
    user_id integer,
    ip_address character varying(45),
    downloaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    file_size_bytes bigint,
    country character varying(100),
    device_type character varying(50),
    CONSTRAINT download_counts_content_type_check CHECK (((content_type)::text = ANY ((ARRAY['thesis'::character varying, 'publication'::character varying, 'dataset'::character varying, 'model'::character varying, 'project'::character varying])::text[])))
);


ALTER TABLE public.download_counts OWNER TO neondb_owner;

--
-- Name: download_counts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.download_counts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.download_counts_id_seq OWNER TO neondb_owner;

--
-- Name: download_counts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.download_counts_id_seq OWNED BY public.download_counts.id;


--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_verification_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.email_verification_tokens OWNER TO neondb_owner;

--
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.email_verification_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_verification_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: email_verification_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.email_verification_tokens_id_seq OWNED BY public.email_verification_tokens.id;


--
-- Name: model_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.model_files (
    id integer NOT NULL,
    model_id integer,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_size numeric,
    file_type text,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.model_files OWNER TO neondb_owner;

--
-- Name: model_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.model_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.model_files_id_seq OWNER TO neondb_owner;

--
-- Name: model_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.model_files_id_seq OWNED BY public.model_files.id;


--
-- Name: models; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.models (
    id integer NOT NULL,
    thesis_id integer,
    title character varying(500) NOT NULL,
    description text,
    model_type character varying(100) NOT NULL,
    framework character varying(100),
    programming_language character varying(100),
    model_size_mb numeric(10,2),
    accuracy numeric(5,4),
    trained_on_dataset_id integer,
    download_url text NOT NULL,
    cloudinary_url text,
    documentation_url text,
    version character varying(50),
    release_date date,
    license character varying(100),
    hyperparameters jsonb,
    training_config jsonb,
    keywords text[],
    tags text[],
    views integer DEFAULT 0,
    downloads integer DEFAULT 0,
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    published_at timestamp without time zone,
    model_url text,
    file_path text,
    workspace_id integer,
    workspace_type text,
    CONSTRAINT models_model_type_check CHECK (((model_type)::text = ANY ((ARRAY['neural_network'::character varying, 'decision_tree'::character varying, 'regression'::character varying, 'classification'::character varying, 'clustering'::character varying, 'nlp'::character varying, 'computer_vision'::character varying, 'reinforcement_learning'::character varying, 'other'::character varying, 'paper'::character varying, 'document'::character varying, 'result'::character varying])::text[]))),
    CONSTRAINT models_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.models OWNER TO neondb_owner;

--
-- Name: models_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.models_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.models_id_seq OWNER TO neondb_owner;

--
-- Name: models_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.models_id_seq OWNED BY public.models.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    link text,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO neondb_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: project_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.project_files (
    id integer NOT NULL,
    project_id integer,
    file_name text NOT NULL,
    file_url text NOT NULL,
    file_path text,
    file_size numeric,
    file_type text,
    resource_type text,
    description text,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_files OWNER TO neondb_owner;

--
-- Name: project_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.project_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_files_id_seq OWNER TO neondb_owner;

--
-- Name: project_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.project_files_id_seq OWNED BY public.project_files.id;


--
-- Name: project_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.project_members (
    id integer NOT NULL,
    project_id integer,
    user_id integer,
    role text NOT NULL,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.project_members OWNER TO neondb_owner;

--
-- Name: project_members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.project_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_members_id_seq OWNER TO neondb_owner;

--
-- Name: project_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.project_members_id_seq OWNED BY public.project_members.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'active'::text NOT NULL,
    department text,
    field text,
    start_date date,
    end_date date,
    funding_amount numeric,
    funding_source text,
    objectives jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    keywords text[] DEFAULT '{}'::text[],
    supervisor_id integer,
    ghost_supervisor character varying(255)
);


ALTER TABLE public.projects OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO neondb_owner;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: publication_authors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.publication_authors (
    id integer NOT NULL,
    publication_id integer NOT NULL,
    author_name character varying(255) NOT NULL,
    author_order integer DEFAULT 1 NOT NULL,
    affiliation character varying(300),
    corresponding_author boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer
);


ALTER TABLE public.publication_authors OWNER TO neondb_owner;

--
-- Name: publication_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.publication_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_authors_id_seq OWNER TO neondb_owner;

--
-- Name: publication_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.publication_authors_id_seq OWNED BY public.publication_authors.id;


--
-- Name: publication_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.publication_files (
    id integer NOT NULL,
    publication_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    file_type character varying(100),
    file_size bigint,
    resource_type character varying(50) NOT NULL,
    file_url text NOT NULL,
    external_link text,
    description text,
    version character varying(50),
    license character varying(100),
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT publication_files_resource_type_check CHECK (((resource_type)::text = ANY ((ARRAY['code'::character varying, 'dataset'::character varying, 'model'::character varying, 'supplementary'::character varying, 'other'::character varying, 'paper'::character varying, 'document'::character varying, 'result'::character varying])::text[])))
);


ALTER TABLE public.publication_files OWNER TO neondb_owner;

--
-- Name: publication_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.publication_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publication_files_id_seq OWNER TO neondb_owner;

--
-- Name: publication_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.publication_files_id_seq OWNED BY public.publication_files.id;


--
-- Name: publications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.publications (
    id integer NOT NULL,
    thesis_id integer,
    title text NOT NULL,
    journal_name character varying(300) NOT NULL,
    publication_type character varying(50) NOT NULL,
    doi character varying(255),
    isbn character varying(50),
    issn character varying(50),
    published_date date,
    year integer NOT NULL,
    volume character varying(50),
    issue character varying(50),
    pages character varying(50),
    publisher character varying(300),
    url text,
    pdf_url text,
    citations integer DEFAULT 0,
    impact_factor numeric(5,3),
    abstract text,
    keywords text[],
    status character varying(50) DEFAULT 'published'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    project_id integer,
    paper_subtype character varying(50) DEFAULT 'journal'::character varying,
    CONSTRAINT publications_publication_type_check CHECK (((publication_type)::text = ANY ((ARRAY['journal'::character varying, 'conference'::character varying, 'workshop'::character varying, 'preprint'::character varying, 'book_chapter'::character varying, 'other'::character varying, 'paper'::character varying, 'document'::character varying, 'result'::character varying])::text[]))),
    CONSTRAINT publications_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending_review'::character varying, 'needs_revision'::character varying, 'approved'::character varying, 'published'::character varying, 'accepted'::character varying, 'in_press'::character varying, 'submitted'::character varying, 'preprint'::character varying])::text[])))
);


ALTER TABLE public.publications OWNER TO neondb_owner;

--
-- Name: publications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.publications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publications_id_seq OWNER TO neondb_owner;

--
-- Name: publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.publications_id_seq OWNED BY public.publications.id;


--
-- Name: registration_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.registration_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    rejection_reason text,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT registration_requests_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


ALTER TABLE public.registration_requests OWNER TO neondb_owner;

--
-- Name: registration_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.registration_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registration_requests_id_seq OWNER TO neondb_owner;

--
-- Name: registration_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.registration_requests_id_seq OWNED BY public.registration_requests.id;


--
-- Name: related_work; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.related_work (
    id integer NOT NULL,
    source_id integer NOT NULL,
    source_type text NOT NULL,
    target_id integer NOT NULL,
    target_type text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.related_work OWNER TO neondb_owner;

--
-- Name: related_work_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.related_work_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.related_work_id_seq OWNER TO neondb_owner;

--
-- Name: related_work_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.related_work_id_seq OWNED BY public.related_work.id;


--
-- Name: resource_links; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resource_links (
    id integer NOT NULL,
    workspace_id integer NOT NULL,
    workspace_type text NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    category text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resource_links OWNER TO neondb_owner;

--
-- Name: resource_links_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.resource_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_links_id_seq OWNER TO neondb_owner;

--
-- Name: resource_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.resource_links_id_seq OWNED BY public.resource_links.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sessions OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO neondb_owner;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: supervision_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.supervision_requests (
    id integer NOT NULL,
    student_id integer,
    thesis_id integer,
    project_id integer,
    supervisor_id integer,
    topic_proposal text,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.supervision_requests OWNER TO neondb_owner;

--
-- Name: supervision_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.supervision_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supervision_requests_id_seq OWNER TO neondb_owner;

--
-- Name: supervision_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.supervision_requests_id_seq OWNED BY public.supervision_requests.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    user_id integer,
    subject text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    priority text DEFAULT 'normal'::text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.support_tickets OWNER TO neondb_owner;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.support_tickets_id_seq OWNER TO neondb_owner;

--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.system_settings (
    id integer DEFAULT 1 NOT NULL,
    settings jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_row_only CHECK ((id = 1))
);


ALTER TABLE public.system_settings OWNER TO neondb_owner;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.team_members (
    id integer NOT NULL,
    thesis_id integer,
    user_id integer,
    role text DEFAULT 'member'::text NOT NULL,
    status text DEFAULT 'invited'::text NOT NULL,
    invited_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    joined_at timestamp with time zone
);


ALTER TABLE public.team_members OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_id_seq OWNER TO neondb_owner;

--
-- Name: team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;


--
-- Name: theses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.theses (
    id integer NOT NULL,
    title text NOT NULL,
    abstract text NOT NULL,
    department character varying(200) NOT NULL,
    field character varying(200),
    year integer NOT NULL,
    submitted_date date NOT NULL,
    status character varying(50) NOT NULL,
    keywords text[] DEFAULT '{}'::text[] NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    supervisor_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    project_id integer,
    ghost_supervisor character varying(255),
    CONSTRAINT theses_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending_review'::character varying, 'needs_revision'::character varying, 'approved'::character varying, 'pending'::character varying, 'rejected'::character varying, 'in-review'::character varying])::text[])))
);


ALTER TABLE public.theses OWNER TO neondb_owner;

--
-- Name: theses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.theses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.theses_id_seq OWNER TO neondb_owner;

--
-- Name: theses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.theses_id_seq OWNED BY public.theses.id;


--
-- Name: thesis_authors; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.thesis_authors (
    id integer NOT NULL,
    thesis_id integer NOT NULL,
    author_id integer,
    author_order integer DEFAULT 1 NOT NULL,
    role character varying(50) DEFAULT 'co_author'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    author_name character varying(255),
    CONSTRAINT thesis_authors_role_check CHECK (((role)::text = ANY ((ARRAY['primary_author'::character varying, 'co_author'::character varying])::text[])))
);


ALTER TABLE public.thesis_authors OWNER TO neondb_owner;

--
-- Name: thesis_authors_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.thesis_authors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thesis_authors_id_seq OWNER TO neondb_owner;

--
-- Name: thesis_authors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.thesis_authors_id_seq OWNED BY public.thesis_authors.id;


--
-- Name: thesis_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.thesis_files (
    id integer NOT NULL,
    thesis_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    file_size character varying(50) NOT NULL,
    file_type character varying(50) NOT NULL,
    file_url text,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resource_type character varying(50) DEFAULT 'document'::character varying,
    external_url text,
    description text,
    file_path text,
    CONSTRAINT thesis_files_file_type_check CHECK (((file_type)::text = ANY ((ARRAY['pdf'::character varying, 'presentation'::character varying, 'video'::character varying, 'audio'::character varying, 'supplementary'::character varying, 'code'::character varying, 'dataset'::character varying, 'model'::character varying, 'csv'::character varying, 'json'::character varying, 'zip'::character varying, 'link'::character varying])::text[])))
);


ALTER TABLE public.thesis_files OWNER TO neondb_owner;

--
-- Name: TABLE thesis_files; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON TABLE public.thesis_files IS 'Thesis resource files including documents, code, datasets, models, videos, audio, and presentations';


--
-- Name: COLUMN thesis_files.resource_type; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.thesis_files.resource_type IS 'Type: document, code, dataset, model, result';


--
-- Name: COLUMN thesis_files.external_url; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.thesis_files.external_url IS 'External URL for GitHub, Drive, Kaggle, etc. NULL for uploaded files';


--
-- Name: COLUMN thesis_files.description; Type: COMMENT; Schema: public; Owner: neondb_owner
--

COMMENT ON COLUMN public.thesis_files.description IS 'Detailed description of the resource';


--
-- Name: thesis_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.thesis_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.thesis_files_id_seq OWNER TO neondb_owner;

--
-- Name: thesis_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.thesis_files_id_seq OWNED BY public.thesis_files.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    student_id character varying(50),
    department character varying(255),
    specialization character varying(255),
    is_approved boolean DEFAULT false,
    approval_date timestamp without time zone,
    approved_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    username character varying(255),
    profile_pic text,
    phone text,
    bio text,
    session text,
    semester text,
    degree text,
    CONSTRAINT student_id_for_students CHECK (((((role)::text = 'student'::text) AND (student_id IS NOT NULL)) OR (((role)::text <> 'student'::text) AND (student_id IS NULL)))),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['student'::character varying, 'supervisor'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: view_counts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.view_counts (
    id integer NOT NULL,
    content_type character varying(50) NOT NULL,
    content_id integer NOT NULL,
    user_id integer,
    ip_address character varying(45),
    user_agent text,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    session_duration_seconds integer,
    country character varying(100),
    device_type character varying(50),
    browser character varying(100),
    CONSTRAINT view_counts_content_type_check CHECK (((content_type)::text = ANY ((ARRAY['thesis'::character varying, 'publication'::character varying, 'dataset'::character varying, 'model'::character varying, 'project'::character varying])::text[])))
);


ALTER TABLE public.view_counts OWNER TO neondb_owner;

--
-- Name: view_counts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.view_counts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.view_counts_id_seq OWNER TO neondb_owner;

--
-- Name: view_counts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.view_counts_id_seq OWNED BY public.view_counts.id;


--
-- Name: workspace_code_files; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.workspace_code_files (
    id integer NOT NULL,
    workspace_id integer NOT NULL,
    workspace_type character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    path text NOT NULL,
    content text,
    is_directory boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.workspace_code_files OWNER TO neondb_owner;

--
-- Name: workspace_code_files_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.workspace_code_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.workspace_code_files_id_seq OWNER TO neondb_owner;

--
-- Name: workspace_code_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.workspace_code_files_id_seq OWNED BY public.workspace_code_files.id;


--
-- Name: authorship_claims id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.authorship_claims ALTER COLUMN id SET DEFAULT nextval('public.authorship_claims_id_seq'::regclass);


--
-- Name: content_contributors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors ALTER COLUMN id SET DEFAULT nextval('public.content_contributors_id_seq'::regclass);


--
-- Name: content_popularity id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_popularity ALTER COLUMN id SET DEFAULT nextval('public.content_popularity_id_seq'::regclass);


--
-- Name: dataset_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dataset_files ALTER COLUMN id SET DEFAULT nextval('public.dataset_files_id_seq'::regclass);


--
-- Name: datasets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.datasets ALTER COLUMN id SET DEFAULT nextval('public.datasets_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: download_counts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.download_counts ALTER COLUMN id SET DEFAULT nextval('public.download_counts_id_seq'::regclass);


--
-- Name: email_verification_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN id SET DEFAULT nextval('public.email_verification_tokens_id_seq'::regclass);


--
-- Name: model_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_files ALTER COLUMN id SET DEFAULT nextval('public.model_files_id_seq'::regclass);


--
-- Name: models id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.models ALTER COLUMN id SET DEFAULT nextval('public.models_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: project_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_files ALTER COLUMN id SET DEFAULT nextval('public.project_files_id_seq'::regclass);


--
-- Name: project_members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_members ALTER COLUMN id SET DEFAULT nextval('public.project_members_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: publication_authors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_authors ALTER COLUMN id SET DEFAULT nextval('public.publication_authors_id_seq'::regclass);


--
-- Name: publication_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_files ALTER COLUMN id SET DEFAULT nextval('public.publication_files_id_seq'::regclass);


--
-- Name: publications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publications ALTER COLUMN id SET DEFAULT nextval('public.publications_id_seq'::regclass);


--
-- Name: registration_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registration_requests ALTER COLUMN id SET DEFAULT nextval('public.registration_requests_id_seq'::regclass);


--
-- Name: related_work id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.related_work ALTER COLUMN id SET DEFAULT nextval('public.related_work_id_seq'::regclass);


--
-- Name: resource_links id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resource_links ALTER COLUMN id SET DEFAULT nextval('public.resource_links_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: supervision_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests ALTER COLUMN id SET DEFAULT nextval('public.supervision_requests_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: team_members id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);


--
-- Name: theses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theses ALTER COLUMN id SET DEFAULT nextval('public.theses_id_seq'::regclass);


--
-- Name: thesis_authors id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_authors ALTER COLUMN id SET DEFAULT nextval('public.thesis_authors_id_seq'::regclass);


--
-- Name: thesis_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_files ALTER COLUMN id SET DEFAULT nextval('public.thesis_files_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: view_counts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.view_counts ALTER COLUMN id SET DEFAULT nextval('public.view_counts_id_seq'::regclass);


--
-- Name: workspace_code_files id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_code_files ALTER COLUMN id SET DEFAULT nextval('public.workspace_code_files_id_seq'::regclass);


--
-- Name: authorship_claims authorship_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.authorship_claims
    ADD CONSTRAINT authorship_claims_pkey PRIMARY KEY (id);


--
-- Name: content_contributors content_contributors_dataset_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_dataset_id_user_id_key UNIQUE (dataset_id, user_id);


--
-- Name: content_contributors content_contributors_model_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_model_id_user_id_key UNIQUE (model_id, user_id);


--
-- Name: content_contributors content_contributors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_pkey PRIMARY KEY (id);


--
-- Name: content_popularity content_popularity_content_type_content_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_popularity
    ADD CONSTRAINT content_popularity_content_type_content_id_key UNIQUE (content_type, content_id);


--
-- Name: content_popularity content_popularity_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_popularity
    ADD CONSTRAINT content_popularity_pkey PRIMARY KEY (id);


--
-- Name: dataset_files dataset_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dataset_files
    ADD CONSTRAINT dataset_files_pkey PRIMARY KEY (id);


--
-- Name: datasets datasets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: download_counts download_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.download_counts
    ADD CONSTRAINT download_counts_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (id);


--
-- Name: email_verification_tokens email_verification_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_key UNIQUE (token);


--
-- Name: model_files model_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_files
    ADD CONSTRAINT model_files_pkey PRIMARY KEY (id);


--
-- Name: models models_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: project_files project_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_pkey PRIMARY KEY (id);


--
-- Name: project_members project_members_project_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_project_id_user_id_key UNIQUE (project_id, user_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: publication_authors publication_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_pkey PRIMARY KEY (id);


--
-- Name: publication_authors publication_authors_publication_id_author_name_author_order_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_publication_id_author_name_author_order_key UNIQUE (publication_id, author_name, author_order);


--
-- Name: publication_files publication_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_files
    ADD CONSTRAINT publication_files_pkey PRIMARY KEY (id);


--
-- Name: publications publications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_pkey PRIMARY KEY (id);


--
-- Name: registration_requests registration_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registration_requests
    ADD CONSTRAINT registration_requests_pkey PRIMARY KEY (id);


--
-- Name: related_work related_work_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.related_work
    ADD CONSTRAINT related_work_pkey PRIMARY KEY (id);


--
-- Name: related_work related_work_source_id_source_type_target_id_target_type_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.related_work
    ADD CONSTRAINT related_work_source_id_source_type_target_id_target_type_key UNIQUE (source_id, source_type, target_id, target_type);


--
-- Name: resource_links resource_links_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resource_links
    ADD CONSTRAINT resource_links_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_token_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_key UNIQUE (token);


--
-- Name: supervision_requests supervision_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests
    ADD CONSTRAINT supervision_requests_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_thesis_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_thesis_id_user_id_key UNIQUE (thesis_id, user_id);


--
-- Name: theses theses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theses
    ADD CONSTRAINT theses_pkey PRIMARY KEY (id);


--
-- Name: thesis_authors thesis_authors_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_authors
    ADD CONSTRAINT thesis_authors_pkey PRIMARY KEY (id);


--
-- Name: thesis_authors thesis_authors_thesis_id_author_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_authors
    ADD CONSTRAINT thesis_authors_thesis_id_author_id_key UNIQUE (thesis_id, author_id);


--
-- Name: thesis_files thesis_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_files
    ADD CONSTRAINT thesis_files_pkey PRIMARY KEY (id);


--
-- Name: workspace_code_files unique_path_per_workspace; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_code_files
    ADD CONSTRAINT unique_path_per_workspace UNIQUE (workspace_id, workspace_type, path);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_student_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_student_id_key UNIQUE (student_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: view_counts view_counts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.view_counts
    ADD CONSTRAINT view_counts_pkey PRIMARY KEY (id);


--
-- Name: workspace_code_files workspace_code_files_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.workspace_code_files
    ADD CONSTRAINT workspace_code_files_pkey PRIMARY KEY (id);


--
-- Name: idx_authorship_claims_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_authorship_claims_status ON public.authorship_claims USING btree (status);


--
-- Name: idx_authorship_claims_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_authorship_claims_user_id ON public.authorship_claims USING btree (user_id);


--
-- Name: idx_content_contributors_dataset; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_contributors_dataset ON public.content_contributors USING btree (dataset_id);


--
-- Name: idx_content_contributors_model; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_contributors_model ON public.content_contributors USING btree (model_id);


--
-- Name: idx_content_contributors_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_contributors_user ON public.content_contributors USING btree (user_id);


--
-- Name: idx_content_popularity_content; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_popularity_content ON public.content_popularity USING btree (content_type, content_id);


--
-- Name: idx_content_popularity_trending; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_popularity_trending ON public.content_popularity USING btree (trending_score DESC);


--
-- Name: idx_content_popularity_views; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_content_popularity_views ON public.content_popularity USING btree (total_views DESC);


--
-- Name: idx_datasets_accessibility; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_datasets_accessibility ON public.datasets USING btree (accessibility_level);


--
-- Name: idx_datasets_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_datasets_created_at ON public.datasets USING btree (created_at DESC);


--
-- Name: idx_datasets_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_datasets_status ON public.datasets USING btree (status);


--
-- Name: idx_datasets_thesis_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_datasets_thesis_id ON public.datasets USING btree (thesis_id);


--
-- Name: idx_datasets_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_datasets_type ON public.datasets USING btree (dataset_type);


--
-- Name: idx_download_counts_content; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_download_counts_content ON public.download_counts USING btree (content_type, content_id);


--
-- Name: idx_download_counts_content_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_download_counts_content_user ON public.download_counts USING btree (content_type, content_id, user_id);


--
-- Name: idx_download_counts_downloaded_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_download_counts_downloaded_at ON public.download_counts USING btree (downloaded_at DESC);


--
-- Name: idx_download_counts_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_download_counts_user ON public.download_counts USING btree (user_id);


--
-- Name: idx_models_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_created_at ON public.models USING btree (created_at DESC);


--
-- Name: idx_models_framework; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_framework ON public.models USING btree (framework);


--
-- Name: idx_models_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_status ON public.models USING btree (status);


--
-- Name: idx_models_thesis_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_thesis_id ON public.models USING btree (thesis_id);


--
-- Name: idx_models_trained_on_dataset; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_trained_on_dataset ON public.models USING btree (trained_on_dataset_id);


--
-- Name: idx_models_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_models_type ON public.models USING btree (model_type);


--
-- Name: idx_publication_authors_publication_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publication_authors_publication_id ON public.publication_authors USING btree (publication_id);


--
-- Name: idx_publication_files_publication_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publication_files_publication_id ON public.publication_files USING btree (publication_id);


--
-- Name: idx_publication_files_resource_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publication_files_resource_type ON public.publication_files USING btree (resource_type);


--
-- Name: idx_publications_thesis_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publications_thesis_id ON public.publications USING btree (thesis_id);


--
-- Name: idx_publications_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publications_type ON public.publications USING btree (publication_type);


--
-- Name: idx_publications_year; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_publications_year ON public.publications USING btree (year);


--
-- Name: idx_registration_requests_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_registration_requests_status ON public.registration_requests USING btree (status);


--
-- Name: idx_registration_requests_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_registration_requests_user_id ON public.registration_requests USING btree (user_id);


--
-- Name: idx_sessions_expires_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_expires_at ON public.sessions USING btree (expires_at);


--
-- Name: idx_sessions_token; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_token ON public.sessions USING btree (token);


--
-- Name: idx_sessions_token_expires; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_token_expires ON public.sessions USING btree (token, expires_at);


--
-- Name: idx_sessions_user_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_sessions_user_id ON public.sessions USING btree (user_id);


--
-- Name: idx_theses_created_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_created_at ON public.theses USING btree (created_at DESC);


--
-- Name: idx_theses_department; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_department ON public.theses USING btree (department);


--
-- Name: idx_theses_keywords; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_keywords ON public.theses USING gin (keywords);


--
-- Name: idx_theses_status; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_status ON public.theses USING btree (status);


--
-- Name: idx_theses_status_created; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_status_created ON public.theses USING btree (status, created_at DESC);


--
-- Name: idx_theses_supervisor; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_supervisor ON public.theses USING btree (supervisor_id);


--
-- Name: idx_theses_year; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_theses_year ON public.theses USING btree (year);


--
-- Name: idx_thesis_authors_author; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_authors_author ON public.thesis_authors USING btree (author_id);


--
-- Name: idx_thesis_authors_thesis; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_authors_thesis ON public.thesis_authors USING btree (thesis_id);


--
-- Name: idx_thesis_authors_thesis_order; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_authors_thesis_order ON public.thesis_authors USING btree (thesis_id, author_order);


--
-- Name: idx_thesis_files_resource_type; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_files_resource_type ON public.thesis_files USING btree (resource_type);


--
-- Name: idx_thesis_files_thesis; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_files_thesis ON public.thesis_files USING btree (thesis_id);


--
-- Name: idx_thesis_files_thesis_id_resource; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_thesis_files_thesis_id_resource ON public.thesis_files USING btree (thesis_id, resource_type);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_email_approved; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_email_approved ON public.users USING btree (email, is_approved);


--
-- Name: idx_users_profile_pic; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_profile_pic ON public.users USING btree (profile_pic) WHERE (profile_pic IS NOT NULL);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_student_id; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_student_id ON public.users USING btree (student_id);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_view_counts_content; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_view_counts_content ON public.view_counts USING btree (content_type, content_id);


--
-- Name: idx_view_counts_content_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_view_counts_content_user ON public.view_counts USING btree (content_type, content_id, user_id);


--
-- Name: idx_view_counts_user; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_view_counts_user ON public.view_counts USING btree (user_id);


--
-- Name: idx_view_counts_viewed_at; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX idx_view_counts_viewed_at ON public.view_counts USING btree (viewed_at DESC);


--
-- Name: authorship_claims authorship_claims_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.authorship_claims
    ADD CONSTRAINT authorship_claims_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: authorship_claims authorship_claims_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.authorship_claims
    ADD CONSTRAINT authorship_claims_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: content_contributors content_contributors_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) ON DELETE CASCADE;


--
-- Name: content_contributors content_contributors_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id) ON DELETE CASCADE;


--
-- Name: content_contributors content_contributors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.content_contributors
    ADD CONSTRAINT content_contributors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: dataset_files dataset_files_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.dataset_files
    ADD CONSTRAINT dataset_files_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES public.datasets(id) ON DELETE CASCADE;


--
-- Name: datasets datasets_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.datasets
    ADD CONSTRAINT datasets_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: download_counts download_counts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.download_counts
    ADD CONSTRAINT download_counts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: model_files model_files_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.model_files
    ADD CONSTRAINT model_files_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id) ON DELETE CASCADE;


--
-- Name: models models_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: models models_trained_on_dataset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.models
    ADD CONSTRAINT models_trained_on_dataset_id_fkey FOREIGN KEY (trained_on_dataset_id) REFERENCES public.datasets(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: project_files project_files_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_files
    ADD CONSTRAINT project_files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_members project_members_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: project_members project_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.project_members
    ADD CONSTRAINT project_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: projects projects_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: publication_authors publication_authors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_authors
    ADD CONSTRAINT publication_authors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: publication_files publication_files_publication_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publication_files
    ADD CONSTRAINT publication_files_publication_id_fkey FOREIGN KEY (publication_id) REFERENCES public.publications(id) ON DELETE CASCADE;


--
-- Name: publications publications_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: publications publications_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.publications
    ADD CONSTRAINT publications_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: registration_requests registration_requests_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registration_requests
    ADD CONSTRAINT registration_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.users(id);


--
-- Name: registration_requests registration_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.registration_requests
    ADD CONSTRAINT registration_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supervision_requests supervision_requests_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests
    ADD CONSTRAINT supervision_requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: supervision_requests supervision_requests_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests
    ADD CONSTRAINT supervision_requests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supervision_requests supervision_requests_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests
    ADD CONSTRAINT supervision_requests_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: supervision_requests supervision_requests_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.supervision_requests
    ADD CONSTRAINT supervision_requests_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: support_tickets support_tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: team_members team_members_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: theses theses_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theses
    ADD CONSTRAINT theses_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;


--
-- Name: theses theses_supervisor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.theses
    ADD CONSTRAINT theses_supervisor_id_fkey FOREIGN KEY (supervisor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: thesis_authors thesis_authors_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_authors
    ADD CONSTRAINT thesis_authors_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: thesis_authors thesis_authors_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_authors
    ADD CONSTRAINT thesis_authors_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: thesis_files thesis_files_thesis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.thesis_files
    ADD CONSTRAINT thesis_files_thesis_id_fkey FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE;


--
-- Name: users users_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: view_counts view_counts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.view_counts
    ADD CONSTRAINT view_counts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--


