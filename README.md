# Nikcode test task

## Installation

1. Clone this repository to your local machine.
2. Build docker image of the app by writing in your console following command (Note: you need to be in the project root dir):

```bash
$ docker build -t financial-manager-api .
```

3. After the end of the build proccess, write in console next command in order to run the app and db containers:

```bash
$ docker-compose up -d
```

4. Wait some time and after check if the app and PostgreSQL containers are running:

```bash
$ docker ps
```

You should see both containers running.

#### Note: Ports 3000 and 5432 on your local machine must be available for containers.

## API manual testing using Swagger

Now you can manually test the API in your browser following this url: http://localhost:3000/docs

## Alternatively, you can run the app in the development mode

Clone the repository and install all dependencies:

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run Jest Unit Tests

```bash
# unit tests
$ npm run test
```
