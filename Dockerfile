FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./api/manage.py", "runserver", "0.0.0.0:8000"]