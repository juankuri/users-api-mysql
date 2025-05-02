FROM debian:bullseye

RUN apt-get update && apt-get install -y curl make g++

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Establecer directorio de trabajo
WORKDIR /app

# Copiar todo el proyecto al contenedor
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto de la API
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["node", "index.js"]
