from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
UserModel = get_user_model()


class MyCustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username:
            if UserModel.objects.filter(Q(username=username) | Q(email=username)).first():
                user = UserModel.objects.filter(
                    Q(username=username) | Q(email=username)
                ).first()
        if user and user.check_password(password):
            return user

        return None