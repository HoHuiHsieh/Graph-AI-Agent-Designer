
import path from "path";
import { loadPackageDefinition, credentials, ChannelCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { promisify } from "util";
import { ProtoGrpcType } from "./grpc_service";
import { GRPCInferenceServiceClient } from "./inference/GRPCInferenceService";
import { ServerReadyRequest } from "./inference/ServerReadyRequest";
import { ServerReadyResponse } from "./inference/ServerReadyResponse";
import { ServerLiveRequest } from "./inference/ServerLiveRequest";
import { ServerLiveResponse } from "./inference/ServerLiveResponse";
import { ModelReadyRequest } from "./inference/ModelReadyRequest";
import { ModelReadyResponse } from "./inference/ModelReadyResponse";
import { ModelConfigRequest } from "./inference/ModelConfigRequest";
import { ModelConfigResponse } from "./inference/ModelConfigResponse";
import { ModelMetadataRequest } from "./inference/ModelMetadataRequest";
import { ModelMetadataResponse } from "./inference/ModelMetadataResponse";
import { ModelStatisticsRequest } from "./inference/ModelStatisticsRequest";
import { ModelStatisticsResponse } from "./inference/ModelStatisticsResponse";
import { ModelInferRequest } from "./inference/ModelInferRequest";
import { ModelInferResponse } from "./inference/ModelInferResponse";


/**
 * 
 */
export class TritonCoreAPI {

    private client: GRPCInferenceServiceClient
    private PROTO_IMPORT_PATH: string = path.resolve() + '/proto';
    private PROTO_PATH: string = this.PROTO_IMPORT_PATH + '/grpc_service.proto'

    /**
     * 
     * @param endpoint 
     * @param creds 
     */
    constructor(endpoint: string, creds?: ChannelCredentials) {
        const packageDefinition = loadSync(this.PROTO_PATH, {
            includeDirs: [this.PROTO_IMPORT_PATH],
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        })
        const loadedPackageDefinition = loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
        const triton = loadedPackageDefinition.inference
        this.client = new triton.GRPCInferenceService(endpoint, creds ?? credentials.createInsecure())
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async serverReady(req: ServerReadyRequest): Promise<ServerReadyResponse> {
        return promisify<ServerReadyRequest>(this.client.serverReady)
            .bind(this.client)(req) as unknown as ServerReadyResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async serverLive(req: ServerLiveRequest): Promise<ServerLiveResponse> {
        return promisify<ServerLiveRequest>(this.client.serverLive)
            .bind(this.client)(req) as unknown as ServerLiveResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async modelReady(req: ModelReadyRequest): Promise<ModelReadyResponse> {
        return promisify<ModelReadyRequest>(this.client.modelReady)
            .bind(this.client)(req) as unknown as ModelReadyResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async modelConfig(req: ModelConfigRequest): Promise<ModelConfigResponse> {
        return promisify<ModelConfigRequest>(this.client.modelConfig)
            .bind(this.client)(req) as unknown as ModelConfigResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async modelMetadata(req: ModelMetadataRequest): Promise<ModelMetadataResponse> {
        return promisify<ModelMetadataRequest>(this.client.modelMetadata)
            .bind(this.client)(req) as unknown as ModelMetadataResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async modelStatistics(req: ModelStatisticsRequest): Promise<ModelStatisticsResponse> {
        return promisify<ModelStatisticsRequest>(this.client.modelStatistics)
            .bind(this.client)(req) as unknown as ModelStatisticsResponse
    }

    /**
     * 
     * @param req 
     * @returns 
     */
    public async modelInfer(req: ModelInferRequest): Promise<ModelInferResponse> {
        return promisify<ModelInferRequest>(this.client.modelInfer)
            .bind(this.client)(req) as unknown as ModelInferResponse
    }
}