from django.core.mail import EmailMessage
from decouple import config
from django.conf import settings

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data["subject"],
            body=data["body"],
            from_email=settings.EMAIL_HOST_USER,
            to=[data["email"]],
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)
