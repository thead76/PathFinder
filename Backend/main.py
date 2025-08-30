from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
import csv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from keybert import KeyBERT
from datetime import datetime

# ------------------ FastAPI App ------------------
app = FastAPI()

# --- CORS (allow frontend to connect) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ Models ------------------
model = SentenceTransformer("all-MiniLM-L12-v2")
kw_model = KeyBERT(model=model)

custom_stopwords = {
    "know", "knowing", "knowledge", "familiar", "familiarity", "skilled", "skill",
    "skills", "ability", "abilities", "capable", "capability", "proficient",
    "proficiency", "expert", "expertise", "experienced", "experience", "working",
    "work", "worked", "works", "good", "strong", "excellent", "background",
    "understanding",
    # Generic career buzzwords
    "motivated", "driven", "passionate", "enthusiastic", "dedicated", "committed",
    "innovative", "creative", "responsible", "hardworking", "self", "learner",
    "learning", "adaptable", "flexible", "collaborative", "team", "player",
    "results", "oriented", "focused", "fast", "quick",
    # Redundant
    "etc", "others", "things", "various"
}

# ------------------ Keyword extraction ------------------
def extract_keywords(text, top_n=5):
    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 2),
        stop_words="english",
        top_n=top_n * 4
    )

    unique_keywords, seen = [], set()
    for kw, score in keywords:
        kw_clean = kw.lower().strip()
        if any(stop in kw_clean.split() for stop in custom_stopwords):
            continue
        if kw_clean not in seen:
            unique_keywords.append(kw_clean)
            seen.add(kw_clean)

    return unique_keywords[:top_n]

# ------------------ Fetch jobs from API ------------------
def fetch_jobs_from_api(description, city, state, country, date_posted):
    keywords = extract_keywords(description)
    query = " ".join(keywords)
    if city:
        query += f" {city}"

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": "993fba48e9mshbde4683173e2b8cp1826c9jsn4b4926fea284",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    querystring = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "date_posted": date_posted if date_posted else "all",
        "country": country if country else "in",
        "language": "en"
    }

    response = requests.get(url, headers=headers, params=querystring)
    if response.status_code == 200:
        return response.json().get("data", [])
    else:
        print("Error fetching data:", response.text)
        return []

# ------------------ Semantic matching ------------------
def match_jobs_semantic(user_input, jobs, title_key="job_title"):
    if not jobs:
        return []

    titles = [job.get(title_key, "") for job in jobs]
    user_emb = model.encode([user_input])
    job_embs = model.encode(titles)
    scores = cosine_similarity(user_emb, job_embs)[0]

    for i, job in enumerate(jobs):
        job["match_score"] = round(float(scores[i]) * 100, 2)

    jobs.sort(key=lambda x: x["match_score"], reverse=True)
    return jobs

# ------------------ Save jobs to CSV ------------------
def save_to_csv(jobs):
    filename = "job_results.csv"
    with open(filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow([
            "Title", "Company", "Location", "Source", "Match Score",
            "Date Posted", "Link"
        ])
        for job in jobs:
            writer.writerow([
                job.get("job_title", ""),
                job.get("employer_name", ""),
                job.get("job_city", ""),
                job.get("job_publisher", ""),
                job.get("match_score", ""),
                job.get("job_posted_at_datetime_utc", "N/A"),
                job.get("job_apply_link", "")
            ])
    return filename

# ------------------ Date formatting ------------------
def format_date(iso_date_str):
    try:
        dt = datetime.fromisoformat(iso_date_str.replace("Z", ""))
        return dt.strftime("%d %b %Y")  # e.g. "27 Aug 2025"
    except Exception:
        return iso_date_str

# ------------------ API Routes ------------------

@app.get("/")
async def root():
    return {"message": "Backend API is running 🚀"}

@app.post("/api/search")
async def search_api(
    description: str = Body(...),
    city: str = Body(""),
    state: str = Body(""),
    country: str = Body(""),
    date_posted: str = Body("")
):
    if not description.strip():
        return {"error": "Please enter a job description."}

    jobs_api = fetch_jobs_from_api(description, city, state, country, date_posted)
    matched_jobs_api = match_jobs_semantic(description, jobs_api, title_key="job_title")

    for job in matched_jobs_api:
        job["source"] = "API"
        if "job_posted_at_datetime_utc" in job and job["job_posted_at_datetime_utc"]:
            job["date_posted"] = format_date(job["job_posted_at_datetime_utc"])
        else:
            job["date_posted"] = "N/A"

    top_jobs = matched_jobs_api[:10]
    save_to_csv(top_jobs)

    return {"jobs": top_jobs}
