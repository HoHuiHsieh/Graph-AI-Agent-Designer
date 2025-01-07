FROM node:20 AS base-container
# Add custom Python packages
RUN apt update \
    && apt install  python3 \
                    python3-psycopg2 \
                    python3-requests \
                    python3-tz \
                    python3-bs4 \
                    python3-redis \
                    python3-pandas \
                    python3-numpy \
                    python3-tz -y \
    && apt clean
RUN npm i -g next nodemon ts-node


FROM base-container AS deploy-container
ENV HOME=/root/ai-agent
# build backend
COPY ./backend $HOME/backend
WORKDIR $HOME/backend
RUN npm install && npm run build
# build frontend
COPY ./frontend $HOME/frontend
WORKDIR $HOME/frontend
RUN npm install && npm run build
# serve project
CMD (cd $HOME/backend && npm start) & \
    (cd $HOME/frontend && npm start)
