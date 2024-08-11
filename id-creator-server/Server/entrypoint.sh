#!/bin/sh


# Apply database migrations
dotnet ef database update

# Start the application
dotnet Server.dll