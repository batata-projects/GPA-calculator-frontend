from supabase import Client


class UsersDAO:
    def __init__(self, client: Client):
        self.client = client
