FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY todo-frontend/package*.json ./
RUN npm clean-install
COPY todo-frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src
COPY TodoApp.csproj ./
RUN dotnet restore
COPY . .
COPY --from=frontend-builder /app/dist ./wwwroot
RUN dotnet publish TodoApp.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=backend-builder /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "TodoApp.dll"]
