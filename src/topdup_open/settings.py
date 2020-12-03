# settings.py
from dotenv import load_dotenv

# OR, explicitly providing path to '.env'
from pathlib import Path  # Python 3.6+ only

load_dotenv()

# OR, the same with increased verbosity
load_dotenv(verbose=True)

env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)
