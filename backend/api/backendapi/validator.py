from django import forms


class BoardValidator(forms.Form):
    name = forms.CharField(max_length=200)


class TodoValidator(forms.Form):
    name = forms.CharField(max_length=200)
    board = forms.IntegerField()


class ItemValidator(forms.Form):
    name = forms.CharField(max_length=200)
    description = forms.CharField(max_length=200)
    completed = forms.BooleanField(required=False)
    todo = forms.IntegerField()


class UserValidator(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(min_length=8)
