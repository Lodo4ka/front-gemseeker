import App from 'app';
import { createRoot } from 'react-dom/client';
import { appStarted } from 'shared/config/init';
import 'features/password-dev';
import { Buffer } from 'buffer'

window.Buffer = Buffer


const container = document.getElementById('root');
const root = createRoot(container!);


appStarted();
root.render(<App />);
