# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ./src/API/API.csproj ./API/
COPY ./src/Context/Context.csproj ./Context/
COPY ./src/Utilities/Utilities.csproj ./Utilities/
RUN dotnet restore "./API/API.csproj" 
#   --> wie npm install

# Copy everything else and build
COPY ./src/API/* ./API/
COPY ./src/Context/* ./Context/
COPY ./src/Utilities/* ./Utilities/
RUN dotnet publish "./API/API.csproj" -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "API.dll"]