#!/bin/sh
python backend/api/manage.py makemigrations
python backend/api/manage.py migrate
python backend/api/manage.py runserver 0.0.0.0:5555