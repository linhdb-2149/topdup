from .post_orm import Post
import jsonpickle


class RawPost:
    def __init__(self, body):
        """Parsing binary data to make Post instance"""
        self.has_error = False

        try:
            self._body = body  # byte data
            unicode_body = str(body, encoding="utf-8")
            self._data = jsonpickle.decode(unicode_body)
            self.title = self.get_title()
            self.content = self.get_content()
            self.author = self.get_author_id()
            self.publish_time = self.get_publish_date()
            self.url = self.get_url()
        except Exception:
            self.has_error = True

    def get_author_id(self):
        if "author" in self._data:
            return self._data["author"]
        return None

    def get_title(self):
        if "title" in self._data:
            return self._data["title"]
        return None

    def get_publish_date(self):
        if "publish_date" in self._data:
            return self._data["publish_date"]
        return None

    def get_content(self):
        all_content = []
        if "content" in self._data:
            content_list = self._data["content"]
            for c in content_list:
                if ("type" in c) and c["type"] == "text":
                    all_content.append(c["content"])
        return ". ".join(all_content)

    def get_url(self):
        if "url" in self._data:
            return self._data["url"]
        return None

    def to_orm_post(self):
        """
        convert to ORM Post format
        """
        if self.has_error:
            return None
        post = Post(
            title=self.title,
            content=self.content,
            url=self.url,
            author=self.author,
            publish_time=self.publish_time,
        )
        return post
