FROM starefossen/github-pages
WORKDIR /app

COPY . .

RUN jekyll build
