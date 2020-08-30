from django import forms


class BoardValidator(forms.Form):
    name = forms.CharField(max_length=200, min_length=1)


class TodoValidator(forms.Form):
    name = forms.CharField(max_length=200, min_length=1)
    board = forms.IntegerField()


class ItemValidator(forms.Form):
    name = forms.CharField(max_length=200, min_length=1)
    description = forms.CharField(max_length=200, min_length=1)
    completed = forms.BooleanField(required=False)
    todo = forms.IntegerField()


class UserValidator(forms.Form):
    username = forms.CharField(max_length=150, min_length=1)
    password = forms.CharField(min_length=8)
