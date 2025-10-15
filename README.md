# @yog4a/viem

A personal encapsulation module for [Viem](https://viem.sh), providing enhanced functionality.

## License

UNLICENSED - Private use only

## Installation

```bash
npm install @yog4a/viem
```

## Usage

```typescript
// Re-exported Viem library
import { viem } from '@yog4a/viem'; 
// Encapsulated Viem library
import { HttpClient, WebsocketClient } from '@yog4a/viem/public';

const httpClient = new HttpClient({ 
    chain: 1,   // Chain ID OR Chain (from viem)
    provider: {
        name: provider.name, // Provider name
        url: provider.endpoints.ethereum.http as `https://${string}`, // Provider URL
        type: provider.endpoints.ethereum.type as 'debug' | 'trace',  // Provider type
    },
    debug: true, // Debug mode (show messages)
});

const websocketClient = new WebsocketClient({ 
    chain: 1,  // Chain ID OR Chain (from viem)
    provider: {
        name: provider.name, // Provider name
        url: provider.endpoints.ethereum.wss as `wss://${string}`, // Provider URL
        type: provider.endpoints.ethereum.type as 'debug' | 'trace', // Provider type
    },
    transportConfig: {
        // Override transport config
    },
    debug: true, // Debug mode (show messages)
});
```