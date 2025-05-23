# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["MiniCrmApi/*.csproj", "MiniCrmApi/"]
RUN dotnet restore "MiniCrmApi/MiniCrmApi.csproj"

# Copy everything else and build
COPY . .
WORKDIR /src/MiniCrmApi
RUN dotnet build "MiniCrmApi.csproj" -c Release -o /app/build

# Publish
RUN dotnet publish "MiniCrmApi.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Configure for Docker environment
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Development

# Run the app
ENTRYPOINT ["dotnet", "MiniCrmApi.dll"]
