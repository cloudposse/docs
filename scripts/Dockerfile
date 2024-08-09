# Use the official Python image as a base
FROM python:3.9-slim

# Set the working directory
WORKDIR /

# Copy the Python requirements file into the container
COPY ./docs-collator/requirements.txt scripts/docs-collator/requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir -r scripts/docs-collator/requirements.txt && \
    apt-get update && \
    apt-get install -y git && \
    apt-get clean


# Copy the rest of the application files into the container
COPY . /scripts

# Make the render scripts executable
RUN chmod +x /scripts/*.sh

# Set the environment variable for GitHub access token
ARG PUBLIC_REPO_ACCESS_TOKEN
ENV PUBLIC_REPO_ACCESS_TOKEN=${PUBLIC_REPO_ACCESS_TOKEN}

# Command to render documentation for Terraform components
CMD ["/scripts/render-docs-for-components.sh"]

# The entry point to render documentation for Terraform modules
ENTRYPOINT ["/bin/bash", "-c"]
