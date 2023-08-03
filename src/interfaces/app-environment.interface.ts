export interface AppEnvironment {
  SHARE: {
    PUBLIC: {
      GATEWAY_CONFIG: {
        METHOD: string;
        HOST: string;
      };
    };
    SECURE: {
      CORS: {
        ORIGIN: string[];
        METHODS: string[];
        ALLOWED_HEADERS: string[];
        EXPOSED_HEADERS: string[];
        CREDENTIALS: boolean;
        PREFLIGHT_CONTINUE: boolean;
      };
      JWT: {
        JWT_SECRET: string;
        TOKEN_EXPIRE: number;
      };
    };
  };
  // In app info
  NAME: string;
  APP: {
    NAME: string;
    PORT: number;
    IP: string;
  };
  DATABASE: {
    MONGODB: {
      USERNAME: string;
      PASSWORD: string;
      HOST: string;
      PORT: number;
      NAME: string;
    };
  };
  EMAIl: {
    USER: string;
    PASSWORD: string;
    HOST: string;
    PORT: number;
    FROM: string;
    SECURE: boolean;
  };
}
