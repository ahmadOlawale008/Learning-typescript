from rest_framework import serializers
from base.models import Post
from django.core.validators import MinLengthValidator, EmailValidator
from base.models import NewUser
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.urls import reverse
from .utils import Util
from django.utils.encoding import smart_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import AuthenticationFailed
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

class ResetPasswordEmailequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    def validate(self, attrs):
        email = attrs.get("email", "")
        request = self.context.get("request")
        if self.Meta.model.objects.filter(email=email).exists():
            user = self.Meta.model.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            
            current_site = get_current_site(request=request).domain
            relativeLink = reverse("drf_api:auth_api:password-reset-confirm", kwargs={"uidb64": uidb64, "token": token})
            absolute_url = (
                f"http://{current_site}{relativeLink}"
            )
            email_body = f"Hello, <br/> Please use this link below to reset your password <br/> <a href='{absolute_url}'>Click me</a>"
            email_subject = "Email Verification from Sample Website"
            data = {"subject": email_subject, "body": email_body, "email": email}

            Util.send_email(data)
            print("-------------------SENT----------------------")
        else:
            raise serializers.ValidationError(
                {"error": "No user was found with this email"}
            )
        return attrs
    class Meta:
        model = NewUser
        fields = ['email']
        
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(validators=[validate_password])
    token = serializers.CharField(min_length=1, max_length=6)
    uidb64 = serializers.CharField(min_length=1)
    def validate(self, attrs):
        password = attrs.get("Password", "")
        token = attrs.get("token", "")
        uidb64 = attrs.get("uidb64", "")
        id = force_str(urlsafe_base64_decode(uidb64))
        user = NewUser.objects.get(id=id)
        user.set_password(password)
        user.save()
        if not PasswordResetTokenGenerator().check_token(user, token):
            raise AuthenticationFailed("The reset link is invalid", 401)
        return attrs
    class Meta:
        extra_kwargs = {"token": {"write_only": True}, "uidb64": {"write_only": True}}
        fields = ["password", "token", "uidb64"]
