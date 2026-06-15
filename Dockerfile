FROM oven/bun:1.2-alpine

# Install kubectl so we can exec into sandbox pods via subprocess
RUN apk add --no-cache curl && \
    KUBECTL_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt) && \
    curl -LO "https://dl.k8s.io/release/${KUBECTL_VERSION}/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && mv kubectl /usr/local/bin/kubectl

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY src/ ./src/

EXPOSE 3000

CMD ["bun", "run", "src/http/server.ts"]