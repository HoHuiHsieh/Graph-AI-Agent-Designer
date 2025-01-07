# Graph AI-Agent Designer
### A Web-Based Application for Designing AI Agents Using Graphs

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/HoHuiHsieh-607b70170/)

## Project Overview
The **Graph AI-Agent Designer** is developed for research, aimed at creating a web-based application that enables users to design AI agents on their personal computers.

This application allows you to design AI agents through an intuitive **Graph-based interface**. A **Graph** in this context represents the workflow of the AI agent, which is composed of **nodes** and the **connections** between them. Here's a breakdown of the main components:

- **Node**: The basic unit in the graph, representing a computation task. It stores data attributes and provides endpoints for connections.
- **Edge**: An connection that links two nodes, representing the dependency between them. For example, the downstream node cannot process until the upstream node completes.
- Users can add, drag, select, and remove both nodes and edges directly through the web GUI.

## Getting Started

### System Requirements
To run this project, you'll need the following:
- **[Docker](https://www.docker.com/)** (version ^27, for the application deployment)

### Docker Compose Quickstart

1. Clone the repository:
    ```bash
    git clone https://github.com/HoHuiHsieh/Graph-AI-Agent-Designer.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Graph-AI-Agent-Designer
    ```
3. Start the application using Docker Compose:
    ```bash
    bash start.sh -b
    ```
4. Open your browser and access the application at ```https://localhost```.

### Developer Mode

1. Attach to ```graph-ai-agent-designer/server:dev``` container.

2. Navigate to the frontend and the backend directories.

3. Start the developer application.
  ```bash
  npm run dev
  ```

4. Coding...

5. Open your browser and check your updates at ```https://localhost:3001```.


## Customise

### LLM Inference Service Providers
You can integrate various LLM (Large Language Model) inference services into the **Graph AI-Agent Designer** workflow. Below is example of service provider:

- **OpenAI**:  
  Access the [OpenAI](https://platform.openai.com/) and apply for your own API key to integrate their LLM services. Once the API key has been obtained, update the environment variables in the `docker-compose.yml` file with the following parameters:
  ```yaml
  environment:
    - OPENAI_API_KEY=your_api_key
  ```

### Python Package
Developers can add their Python packages to run their code in the workflow. These packages can be installed by modifying the **Dockerfile** in project folder.

To install custom Python packages, add the necessary installation commands to the Dockerfile like this:

```dockerfile
...
# Add custom Python packages
RUN apt update \
    && apt install python3 python3-<package_name_1> python3-<package_name_2> ... -y \
    && apt clean
...
```

Ensure that all required dependencies for your custom nodes are specified and installed through the Dockerfile to avoid runtime issues. After making changes, rebuild the Docker image to apply the updates.

## Screenshot
![Screenshot](/image/example.png)
