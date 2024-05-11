from django.shortcuts import render
from rest_framework_simplejwt.tokens import Token
from base.models import Post, NewUser
from .serializers import (
    PostSerializers,
    UserSerializer,
)
from rest_framework import generics
from rest_framework.permissions import (
    BasePermission,
    DjangoModelPermissionsOrAnonReadOnly,
    IsAuthenticatedOrReadOnly,
    IsAdminUser,
    AllowAny,
)
from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.filters import SearchFilter
from django.core.mail import send_mail


class PostUserWritePermission(BasePermission):
    message = "Editing posts is restricted to the author only"
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class PostList(generics.ListCreateAPIView):
    permission_classes = []
    queryset = Post.postObjects.all()
    serializer_class = PostSerializers
    filter_backends = [SearchFilter]
    search_fields = ["^slug"]
    # Exact matches
    # ^Starts with
    #  @ full text search
    #  $ regex search


class PostDetail(generics.RetrieveAPIView, PostUserWritePermission):
    queryset = Post.objects.all()
    serializer_class = PostSerializers

    def get_object(self):
        item = self.kwargs.get("pk")
        return get_object_or_404(Post, slug=item)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser 

class AdminPostUpload(APIView):
    parser_classes = [MultiPartParser, FormParser]
    def post(self, request, format=None):
        print(request.data)
        serializer = PostSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK )

class AdminPostDetail(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializers