FROM node:lts-alpine

WORKDIR /app
# Install python, make and g++, required by node-gyp
RUN apk add --update --no-cache python3 make g++

# Create a symbolic link for Python
RUN ln -sf python3 /usr/bin/python
COPY package*.json ./
RUN npm i
COPY . .

CMD [ "npm", "start" ]