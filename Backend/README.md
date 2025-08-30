

# 🔎 Job Recommender with FastAPI

This project is a **Job Recommendation Web App** built with **FastAPI**, **Sentence-Transformers**, and **KeyBERT**.
It extracts **keywords** from a user’s job description, fetches matching job listings via the **JSearch API**, and ranks them using **semantic similarity**.

---

## 🚀 Features

* ✅ Extracts relevant keywords from job descriptions using **KeyBERT**
* ✅ Filters out unnecessary words (e.g., *skilled, knowledge, experience*)
* ✅ Fetches jobs dynamically from the **JSearch API**
* ✅ Ranks jobs by **semantic similarity** to user input
* ✅ Displays top 10 job matches in a neat results page
* ✅ Saves results to **CSV**
* ✅ User-friendly interface with **Jinja2 templates**

---

## 🛠️ Tech Stack

* **Backend:** FastAPI
* **Templates:** Jinja2
* **Machine Learning:** Sentence-Transformers, KeyBERT, Scikit-learn
* **Frontend:** HTML + Bootstrap
* **Deployment-ready:** Uvicorn

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/job-recommender-fastapi.git
cd job-recommender-fastapi
```

### 2. Create virtual environment (recommended)

```bash
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add your API key

Edit the file **main.py** and replace the placeholder:

```python
headers = {
    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}
```

---

## ▶️ Run the App

Start the FastAPI server with Uvicorn:

```bash
uvicorn main:app --reload
```

Now open your browser at 👉 **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

---

## 📂 Project Structure

```
├── main.py                      # FastAPI backend
├── requirements.txt             # Dependencies
├── templates/
│   ├── index.html               # Home page (form)
│   └── results.html             # Results page
├── static/data/
│   └──locations.json            # country+state+city 
├── job_results.csv              # Saved job search results
└── README.md                    # Project documentation
```

---

## 📊 Example Workflow

1. Enter a job description + location
2. App extracts **keywords**
3. Fetches jobs from **JSearch API**
4. Ranks them by **semantic similarity**
5. Displays **Top 10 results**

---

## 🤝 Contributing

Contributions are welcome!

* Fork the repo
* Create a feature branch
* Submit a Pull Request 🚀
