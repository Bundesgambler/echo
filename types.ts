
export interface GenerationResponse {
  imageUrl: string;
  headline?: string;
  subline?: string;
  success: boolean;
}

export interface N8nPayload {
  chatInput: string;
  headline?: string;
  subline?: string;
  backgroundInfo?: string;
  headlineFixed?: boolean;
  sublineFixed?: boolean;
  important?: string;
  customImage?: string; // Base64 encoded image string
  logoOverlay?: string; // Base64 encoded overlay image string
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  COMMUNICATING_WEBHOOK = 'COMMUNICATING_WEBHOOK',
  PROCESSING_IMAGE = 'PROCESSING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface OverlaySetting {
  name: string;
  url: string;
}
