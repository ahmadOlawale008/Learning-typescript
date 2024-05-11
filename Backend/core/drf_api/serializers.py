from rest_framework import serializers
from base.models import Post
from django.core.validators import MinLengthValidator, EmailValidator
from base.models import NewUser
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.urls import reverse
from django.contrib.sites.shortcuts import get_current_site


def validate_username(value):
    user = get_user_model()
    if user.objects.filter(username=value).exists():
        raise serializers.ValidationError("A user with this username already exists")
    if not value.strip().isalnum():
        raise serializers.ValidationError(
            "Please make sure that your username contains only alphanumeric words"
        )
    return value
def validate_password(value):
    if not any(char.isalnum() for char in value):
        raise serializers.ValidationError(
            "Ensure that your password contain numeric values and special characters for security reasons"
        )
    if not any(char in '!@#$%^&*"()-_=+{}[]|;:,.<>?/' for char in value):
        raise serializers.ValidationError(
            
            "Ensure that your passwords also contain special characters such as !@#$%^&*\"()-_=+{}'[]|;:,.<>?/"
        )
    return value


def validate_email(value):
    user = get_user_model()
    if user.objects.filter(email=value).exists():
        raise serializers.ValidationError("A user with this email already exists")
    return value


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user: get_user_model):
        token = super().get_token(user)
        token["name"] = user.username
        token["email"] = user.email
        token["user_id"] = user.id
        token["phone_number"] = user.phone_number
        token["status"] = (
            "isAdmin"
            if user.is_superuser
            else ("isStaff" if user.is_staff else "isAnonymous")
        )
        return token


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[validate_username, MinLengthValidator(3)]
    )
    email = serializers.EmailField(validators=[validate_email, EmailValidator])
    password = serializers.CharField(
        validators=[MinLengthValidator(6), validate_password]
    )
    confirm_password = serializers.CharField()

    def create(self, validated_data):
        password = validated_data.get("password", None)
        email = validated_data.get("email")
        username = validated_data.get("username")
        phone_number = validated_data.get("phone_number")
        instance = self.Meta.model(
            username=username, email=email, password=password, phone_number=phone_number
        )
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    def validate(self, attrs):
        password, confirm_password = attrs.get("password", None), attrs.get(
            "confirm_password", None
        )
        if password != confirm_password:
            raise serializers.ValidationError(
                {
                    "password": ["Ensure that both passwords are equal"],
                    "confirm_password": ["Ensure that both passwords are equal"],
                }
            )
        return attrs

    class Meta:
        model = NewUser
        fields = ["username", "email", "phone_number", "password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "confirm_password": {"write_only": True},
        }
# class ResetPasswordEmailRequestSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(required=True)
#     def validate(self, attrs):
#         email = attrs.get("email", "")
#         if NewUser.objects.filter(email=email).exists():
#             user = NewUser.objects.get(email=email)
#             uidb64 = urlsafe_base64_encode(user.id)
#             token = PasswordResetTokenGenerator().make_token(user)
#             current_site = get_current_site(request=attrs.get("request")).domain
#             relativeLink = reverse("password-reset-confirm", kwargs={"token": token, "uidb64": uidb64})
#             absoluteUrl = f"http://{current_site}\{relativeLink}?token={token}"
#             msg = f"Hello {user.username}!\n You can confirm your account email through the link below: \n {relativeLink}"
#             Util.send_email(
#                 data={
#                     "subject": "Email Confirmation",
#                     "body": msg,
#                     "email": user.email,
#                 }
#             )
#         return super().validate(attrs)
#     class Meta:
#         fields = ["email"]


class PostSerializers(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ["id", "title", "author", "category", "image", "status"]
        extra_kwargs = {"slug": {"read_only": True}}
