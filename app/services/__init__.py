class ContatoService:

    def __init__(self):

        self.repository = ContatoRepository()

        self.conversa_service = ConversaService()