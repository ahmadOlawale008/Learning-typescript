from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from django.core.mail import send_mail
from .serializers import UserSerializer
from base.models import NewUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import ResetPasswordEmailequestSerializer, SetNewPasswordSerializer
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str
from django.utils.encoding import (
    smart_str,
    smart_bytes,
    force_str,
    DjangoUnicodeDecodeError,
)

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework_simplejwt.tokens import RefreshToken
class CustomUserCreate(APIView):
    permission_classes = [
        AllowAny,
    ]
    authentication_classes = []

    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        email = request.data.get("email", None)

        print("Sent----------")
        if user_serializer.is_valid():
            user = user_serializer.save()
            auth_user = NewUser.objects.get(email=email)

            if user and auth_user:
                auth_user.is_active = False
                send_mail(
                    subject="Password Confirmation",
                    message=f"Hello {auth_user.username}!\n You can confirm your account email through the link below: \n https://chat.openai.com/c/d7e48da8-e917-40df-853f-d204e51ba591",
                    from_email="kassimolwale15@gmail.com",
                    recipient_list=[str(auth_user.email)],
                )
                return Response(status=status.HTTP_201_CREATED)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(user_serializer.errors, user_serializer.error_messages)
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlackListTokenView(APIView):
    permission_classes = [
        AllowAny,
    ]

    def post(self, request):
        try:
            token = RefreshToken(token=request.data.get("refresh_token"))
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})

class RequestPasswordResetEmail(GenericAPIView):
    serializer_class = ResetPasswordEmailequestSerializer
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response({"success": "We have sent you a link to your email to reset your password"}, status=status.HTTP_200_OK)

class PasswordTokenCheckAPI(GenericAPIView):
    def get(self, request,  uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = NewUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({"error": "Token is not valid, please request a new one"}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({"success": True, "message": "Credentials Valid", "uidb64": uidb64, "token": token})
        except DjangoUnicodeDecodeError as e:
            return Response(
                {
                    "success": False,
                    "error": "User does not exist"
                }
            )

class SetNewPasswordApiView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    def patch(self, request):
        serializer = SetNewPasswordSerializer(request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"success": True, "message": "Password reset was successfull"}, status=status.HTTP_200_OK)
