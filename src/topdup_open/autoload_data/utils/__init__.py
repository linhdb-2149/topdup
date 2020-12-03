import os
import pickle

from .. import _config
from .. import log

logger = log.get_logger(__name__)

# def save_data_to_json(posts, json_file=_config.JSON_DATASET):
#     if len(posts) > 0:
#         all_posts = []
#         try:
#             with open(json_file, encoding='utf-8') as json_data:
#                 all_posts = json.load(json_data)
#         except:
#             pass
#         all_posts.extend(posts)
#         with open(json_file, 'w+') as f:
#             json.dump(all_posts, f)


def save_body_to_pickle(items, fn=_config.PICKLE_DATASET):
    old_items = []
    if os.path.isfile(fn):
        try:
            f = open(fn, "rb+")
            old_items = pickle.load(f)
            f.close()
        except Exception:
            pass
    old_items.extend(items)
    f = open(fn, "wb+")
    pickle.dump(old_items, f)
    f.close()


def load_body_from_pickle(fn=_config.PICKLE_DATASET):
    all_items = []
    try:
        f = open(fn, "rb+")
        all_items = pickle.load(f)
        f.close()
    except Exception:
        logger.debug("pickle file is empty")
    return all_items
