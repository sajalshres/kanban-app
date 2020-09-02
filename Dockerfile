FROM python:3


ENV PYTHONBUFFERED 1

RUN mkdir /code

WORKDIR /code

COPY . /code


RUN pip install -r backend/api/requirements.txt
RUN chmod +x init.sh

ENTRYPOINT [ "./init.sh" ]