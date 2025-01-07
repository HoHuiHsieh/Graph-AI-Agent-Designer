#!/bin/bash
export COMPOSE_YAML="docker-compose.yml"
export PROJECT_NAME="graph-ai-agent-designer"
flags()
{
    
    while test $# -gt 0
    do
        case "$1" in
        -b|--build)
            docker compose -f $COMPOSE_YAML -p $PROJECT_NAME build
            ;;
        *) usage;;
        esac
        shift
    done
}
flags "$@"
docker compose -f $COMPOSE_YAML -p $PROJECT_NAME up -d --remove-orphans