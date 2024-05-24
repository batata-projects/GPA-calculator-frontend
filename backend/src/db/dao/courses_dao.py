from supabase import Client


class CoursesDAO:
    def __init__(self, client: Client):
        self.client = client
