from supabase import Client


class TermsDAO:
    def __init__(self, client: Client):
        self.client = client
