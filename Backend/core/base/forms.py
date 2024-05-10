# from django import forms
# from django.contrib.auth.models import User
# from base.models import UserProfile


# class UserForm(forms.ModelForm):
#     first_name = forms.CharField(
#         widget=forms.TextInput(
#             attrs={
#                 "class": "bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
#             }
#         )
#     )
#     last_name = forms.CharField(
#         widget=forms.TextInput(
#             attrs={
#                 "class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
#             }
#         )
#     )

#     class Meta:
#         model = User
#         fields = ["first_name", "last_name"]


# class UserProfileForm(forms.ModelForm):
#     age = forms.IntegerField(
#         widget=forms.NumberInput(
#             attrs={
#                 "class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
#             }
#         )
#     )
#     nickname = forms.CharField(
#         widget=forms.TextInput(
#             attrs={
#                 "class": "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
#             }
#         )
#     )

#     class Meta:
#         model = UserProfile
#         fields = [
#             "age",
#             "nickname",
#         ]
