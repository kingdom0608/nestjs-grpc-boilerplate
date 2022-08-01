import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

function generateDNS() {
  return '0.0.0.0';
}

export const APP_PORTS = {
  user: 5001,
  product: 5002,
};

export function configureGrpc(
  domainName: string,
  serviceName: string,
): ClientOptions {
  const protoDirPath = join(
    process.env.PWD,
    `/proto/${domainName}`,
    `/${serviceName}.proto`,
  );

  const url = `${generateDNS()}:${APP_PORTS[serviceName]}`;

  return {
    transport: Transport.GRPC,
    options: {
      url: url,
      keepalive: {
        keepaliveTimeMs: 5000,
        keepaliveTimeoutMs: 1000,
        keepalivePermitWithoutCalls: 1,
      },
      package: [`${domainName}`],
      protoPath: [protoDirPath],
      loader: {
        includeDirs: [join(process.env.PWD, `/proto/${domainName}`)],
      },
    },
  };
}
