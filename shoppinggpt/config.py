# config.py
import os
from pathlib import Path
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings

# Repository root (parent of the shoppinggpt package directory)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
load_dotenv(BASE_DIR / ".env")

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Paths
DATA_PRODUCT_PATH = str(BASE_DIR / "data" / "products.db")
DATA_TEXT_PATH = str(BASE_DIR / "data" / "policy.txt")
STORE_DIRECTORY = str(BASE_DIR / "data" / "datastore")

# Embeddings
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
