import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'org.ghost.koenig.demo',
    appName: 'Koenig Demo',
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
        url: 'http://127.0.0.1:5173/'
    }
};

export default config;
