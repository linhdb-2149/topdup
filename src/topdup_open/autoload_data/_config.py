import os
from dotenv import load_dotenv  # comment if using docker

# load environment variable
load_dotenv(".env")  # comment if using docker
# RabbitMQ host
HOST = "tech-monitor.vnalert.vn"
PORT = 19000
USERNAME = os.environ["USERNAME_MONITOR"]
PASSWORD = os.environ["PASSWORD_MONITOR"]
EXCHANGE = "docbao_tech_protect"
POST_QUEUE = "tech_protect_AI"  # queue to bind to get posts
MAX_POST = 10  # number of post to push each queue
WAIT_BETWEEN_POST = 0.5

# file, model path
PROJECT_DIR = os.getcwd()
# PROJECT_DIR = '/app'
EMBEDDING_FILE = f"{PROJECT_DIR}/dataset/post_embedding.pkl"
DATABASE_URI = f"sqlite:///{PROJECT_DIR}/dataset/post_database.db"
TF_IDF = f"{PROJECT_DIR}/dataset/tf_idf_model.pkl"
FAKE_DATASET = f"{PROJECT_DIR}/dataset/fake_dataset.csv"
LOG_FILE = f"{PROJECT_DIR}/dataset/logs.txt"

# save data for debug
PICKLE_DATASET = f"{PROJECT_DIR}/dataset/post_dataset.pkl"

# other global variable
TOP_K = 5
MAX_LOAD_TIME = 5
SAVE_THRESH = 0.3
SENTENCE__SCORE_THRESH = 0.65
MIN_CHARACTER_LEN = 500
