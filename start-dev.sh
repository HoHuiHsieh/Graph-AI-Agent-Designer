docker run -itd --rm \
    --name node-dev \
    -v $PWD:/workspace \
    -w /workspace \
    -p 3000:3000 \
    -p 3001:3001 \
    node:20 bash
    