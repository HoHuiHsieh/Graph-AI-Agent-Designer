# My-LangGraph-Agent
### A Web-Based Application for Designing AI Agents Using Graphs
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://www.linkedin.com/in/HoHuiHsieh-607b70170/)

## Version
Previous version: **0.1.0** (Graph-AI-Agent-Designer)
Current version: **0.2.0**

## Description
This project is a hands-on learning initiative to create a web-based low-code platform that empowers users to design and deploy multi-agent AI systems directly on their personal computers.

The application integrates three core modules to deliver its functionality:
1. **LangGraph**: A low-level orchestration framework designed for building controllable AI agents. While LangChain simplifies LLM application development with integrations and composable components, LangGraph focuses on agent orchestration, offering features like customizable architectures, long-term memory, and human-in-the-loop capabilities to tackle complex tasks reliably.
2. **ReactFlow**: A robust library for creating interactive, node-based user interfaces (graph editors or flow editors) in React, enabling intuitive visual design of AI workflows.
3. **Next.js**: A full-stack React framework that provides the tools needed to handle both the front-end and back-end aspects of building web applications. It enables developers to create scalable, performant, and feature-rich applications with ease.

Together, these modules provide a seamless environment for designing, visualizing, and managing AI agent workflows.

**Note:** This project is currently under active development. Debugging and testing are ongoing to ensure stability and functionality.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/HoHuiHsieh/Graph-AI-Agent-Designer.git
   ```
2. Navigate to the project directory:
   ```bash
   cd My-LangGraph-Agent
   ```
3. Start a development container:
    ```bash
    ./start-dev.sh
    ```
    
4. Attach to the bash of the running Docker container:
    ```bash
    docker exec -it <container_name> /bin/bash
    ```

5. Install the required packages:
    ```bash
    npm install
    ```

## Usage
1. Attach to the bash of the running Docker container:
    ```bash
    docker exec -it <container_name> /bin/bash
    ```
    
2. Run the application:
   ```bash
   npm run dev
   ```
   
2. Access the application at `http://localhost:3000`.

## License
This project is licensed under the  GPL-3.0 License. See the [LICENSE](LICENSE) file for details.