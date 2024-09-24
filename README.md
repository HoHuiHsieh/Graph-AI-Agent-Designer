# Graph AI-Agent Designer
### A Web-Based Application for Designing AI Agents Using Graphs

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/HoHuiHsieh-607b70170/)

## Project Overview
The **Graph AI-Agent Designer** is developed for academic research, aimed at creating a web-based application that enables users to design AI agents on their personal computers.

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
    bash start-serve.sh
    ```
4. Open your browser and access the application at ```https://localhost```.


## Customise

### Customise Nodes
Developers can create custom nodes to extend the functionality of the **Graph AI-Agent Designer**. Scripts for customized nodes should be added to the following folders:

- **Frontend Node Scripts**:  
  Add custom node scripts to `frontend/src/components/WorkFlow/ViewPort/Nodes`. Each node script in the frontend folder should include the following components:
  - **label**: The label text displayed on the node in the UI.
  - **title**: The title of the input form that appears when interacting with the node.
  - **node**: A node component representing the node's behavior in the workflow.
  - **form**: An input form component for configuring node parameters.
  - **draggable**: A draggable component that allows the node to be moved within the workflow interface.

- **Backend Node Scripts**:  
  Add custom node scripts to `backend/src/Workflow/Nodes`. Each node script in the backend should contain:
  - **Class with constructor and action function**: The class should define the node's properties and initialize required attributes. An `action` function that implements the logic of the node's task or computation.

Developers can refer to the example codes in the respective frontend and backend folders for guidance on how to structure their custom nodes.

### Customise LLM Inference Service Providers
You can integrate various LLM (Large Language Model) inference services into the **Graph AI-Agent Designer** workflow. Below are some examples of service providers:

- **Taiwan Computing Cloud (TWCC)**:  
  Access the [TWCC documentation](https://docs.twcc.ai/) and apply for your own API key to integrate their LLM services. Once the API key has been obtained, update the environment variables in the `docker-compose.yml` file with the following parameters:
  ```yaml
  environment:
    - TWCC_API_URL=your_twcc_api_url
    - TWCC_API_KEY=your_twcc_api_key
  ```
  
- **Local Triton Inference Server with TensorRT-LLM Backend**:  
  Developers can deploy their own Triton inference server with the TensorRT-LLM backend. You can find more information and deployment instructions here:  
  [TensorRT LLM Backend GitHub](https://github.com/triton-inference-server/tensorrtllm_backend).

Once the services have been customized, ensure the relevant scripts in the ```backend/src/API``` path are updated to reflect the changes and API connections.

### Customise Python Packages
Developers can add their own Python packages to run custom Python code within the nodes. These packages can be installed by modifying the **Dockerfile** in project folder.

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

### Text-to-Speech (TTS) Service
To enable the text-to-speech functionality, developers need to deploy their own TTS model. One example is the **SeamlessM4T-v2** model, which can be used for multilingual speech generation.  
Reference link: [SeamlessM4T-v2 on Hugging Face](https://huggingface.co/facebook/seamless-m4t-v2-large).

Once the TTS service has been deployed, update the corresponding script files in ```backend/src/API``` to integrate the TTS functionality.

### Automatic Speech Recognition (ASR) Service
For speech recognition capabilities, developers can deploy their own ASR model. An example is the **Whisper** model by OpenAI, which can handle large-scale speech-to-text tasks.  
Reference link: [Whisper Large v3 on Hugging Face](https://huggingface.co/openai/whisper-large-v3).

After deploying the ASR service, modify the scripts in the ```backend/src/API``` path to integrate the ASR service.


## Demo
A demo of a custom AI-agent.

![My Demo AI-Agent](/image/demo-agent.png)

A demo of a visual AI-agent.

![Visual AI Agent](/image/visual-agent.png)
