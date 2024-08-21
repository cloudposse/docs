# Use the official Python image as a base
FROM python:3.9-slim

# Set the working directory
WORKDIR /

# Copy the Python requirements file into the container
COPY ./docs-collator/requirements.txt scripts/docs-collator/requirements.txt

ARG TERRAFORM_DOCS_VERSION=0.18.0
ARG TARGETARCH

# Install the Python dependencies
RUN pip install --no-cache-dir -r scripts/docs-collator/requirements.txt
RUN apt-get update && \
    apt-get install -y git wget curl make && \
    wget https://github.com/terraform-docs/terraform-docs/releases/download/v${TERRAFORM_DOCS_VERSION}/terraform-docs-v${TERRAFORM_DOCS_VERSION}-linux-${TARGETARCH}.tar.gz && \
    tar xzf terraform-docs-v${TERRAFORM_DOCS_VERSION}-linux-${TARGETARCH}.tar.gz && \
    mv terraform-docs /usr/local/bin && \
    rm terraform-docs-v${TERRAFORM_DOCS_VERSION}-linux-${TARGETARCH}.tar.gz && \
    apt-get remove -y wget && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

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
